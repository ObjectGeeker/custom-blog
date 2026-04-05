"use client";

import { useState } from "react";
import type { DragEvent } from "react";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";

function parentKey(parentId: string | null): string {
  return parentId ?? "";
}

function insertBeforeSiblingIds(siblingIds: string[], draggedId: string, beforeId: string): string[] {
  if (draggedId === beforeId) return siblingIds;
  const without = siblingIds.filter((id) => id !== draggedId);
  const idx = without.indexOf(beforeId);
  if (idx < 0) return siblingIds;
  const next = [...without];
  next.splice(idx, 0, draggedId);
  return next;
}

function moveToEnd(siblingIds: string[], draggedId: string): string[] {
  const without = siblingIds.filter((id) => id !== draggedId);
  return [...without, draggedId];
}

function parseTreeDragPayload(e: DragEvent): { id: string; parentKey: string } | null {
  try {
    const raw = e.dataTransfer.getData("application/json");
    if (!raw) return null;
    const o = JSON.parse(raw) as { id?: string; parentKey?: string };
    if (!o.id) return null;
    return { id: o.id, parentKey: o.parentKey ?? "" };
  } catch {
    return null;
  }
}

export interface TreeNode {
  id: string;
  name: string;
  desc: string;
  businessLevel: number;
  parentId: string | null;
  children: TreeNode[];
}

interface TreeManagerProps {
  tree: TreeNode[];
  maxLevel?: number;
  onCreate: (name: string, desc: string, parentId: string | null, level: number) => Promise<void>;
  onUpdate: (id: string, name: string, desc: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  /** 同级拖动排序完成后调用，传入新的同级 id 顺序（含从 0 递增的语义，由调用方写入后端） */
  onReorderSiblings?: (parentId: string | null, orderedChildIds: string[]) => Promise<void>;
}

interface TreeNodeItemProps {
  node: TreeNode;
  parentId: string | null;
  siblings: TreeNode[];
  maxLevel: number;
  onCreate: TreeManagerProps["onCreate"];
  onUpdate: TreeManagerProps["onUpdate"];
  onDelete: TreeManagerProps["onDelete"];
  onReorderSiblings?: TreeManagerProps["onReorderSiblings"];
}

function SiblingEndDropZone({
  parentId,
  siblingIds,
  onReorderSiblings,
}: {
  parentId: string | null;
  siblingIds: string[];
  onReorderSiblings: NonNullable<TreeManagerProps["onReorderSiblings"]>;
}) {
  if (siblingIds.length < 2) return null;

  return (
    <div
      className="ml-6 py-1 pl-2 text-xs text-muted-foreground/80"
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }}
      onDrop={async (e) => {
        e.preventDefault();
        const p = parseTreeDragPayload(e);
        if (!p || p.parentKey !== parentKey(parentId)) return;
        const next = moveToEnd(siblingIds, p.id);
        try {
          await onReorderSiblings(parentId, next);
        } catch {
          /* parent */
        }
      }}
    >
      拖放到此处可移到同级末尾
    </div>
  );
}

function TreeNodeItem({
  node,
  parentId,
  siblings,
  maxLevel,
  onCreate,
  onUpdate,
  onDelete,
  onReorderSiblings,
}: TreeNodeItemProps) {
  const [expanded, setExpanded] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(node.name);
  const [editDesc, setEditDesc] = useState(node.desc);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const hasChildren = node.children && node.children.length > 0;
  const canAddChild = node.businessLevel < maxLevel;

  async function handleUpdate() {
    if (!editName.trim()) return;
    setLoading(true);
    try {
      await onUpdate(node.id, editName.trim(), editDesc.trim());
      setEditing(false);
    } catch {
      /* handled by parent */
    }
    setLoading(false);
  }

  async function handleCreate() {
    if (!newName.trim()) return;
    setLoading(true);
    try {
      await onCreate(newName.trim(), newDesc.trim(), node.id, node.businessLevel + 1);
      setAdding(false);
      setNewName("");
      setNewDesc("");
      setExpanded(true);
    } catch {
      /* handled by parent */
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm(`确定删除「${node.name}」吗？`)) return;
    setLoading(true);
    try {
      await onDelete(node.id);
    } catch {
      /* handled by parent */
    }
    setLoading(false);
  }

  const rowDragProps =
    onReorderSiblings != null
      ? {
          onDragOver: (e: DragEvent) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
          },
          onDrop: async (e: DragEvent) => {
            e.preventDefault();
            const p = parseTreeDragPayload(e);
            if (!p || p.parentKey !== parentKey(parentId) || p.id === node.id) return;
            const ids = siblings.map((s) => s.id);
            const next = insertBeforeSiblingIds(ids, p.id, node.id);
            try {
              await onReorderSiblings(parentId, next);
            } catch {
              /* parent */
            }
          },
        }
      : {};

  return (
    <div>
      <div
        className="group flex items-center gap-1 rounded-md py-1 pr-2 hover:bg-secondary"
        {...rowDragProps}
      >
        {onReorderSiblings != null && (
          <span
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(
                "application/json",
                JSON.stringify({ id: node.id, parentKey: parentKey(parentId) }),
              );
              e.dataTransfer.effectAllowed = "move";
            }}
            className="flex h-6 w-6 shrink-0 cursor-grab items-center justify-center text-muted-foreground active:cursor-grabbing"
            title="拖动排序（仅同级）"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4" />
          </span>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex h-6 w-6 shrink-0 items-center justify-center text-muted-foreground"
        >
          {hasChildren ? (
            expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          ) : (
            <span className="h-4 w-4" />
          )}
        </button>

        {editing ? (
          <div className="flex flex-1 items-center gap-2">
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="h-7 flex-1 rounded border border-border bg-background px-2 text-sm outline-none focus:border-ring"
              autoFocus
            />
            <input
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              placeholder="描述"
              className="h-7 w-32 rounded border border-border bg-background px-2 text-sm outline-none focus:border-ring"
            />
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="flex h-6 w-6 items-center justify-center rounded text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setEditName(node.name);
                setEditDesc(node.desc);
              }}
              className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-secondary"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <>
            <span className="flex-1 text-sm">{node.name}</span>
            {node.desc && (
              <span className="mr-2 text-xs text-muted-foreground">{node.desc}</span>
            )}
            <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={() => setEditing(true)}
                className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-background hover:text-foreground"
                title="编辑"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              {canAddChild && (
                <button
                  onClick={() => setAdding(true)}
                  className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-background hover:text-foreground"
                  title="添加子项"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-background hover:text-destructive"
                title="删除"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </>
        )}
      </div>

      {expanded && hasChildren && (
        <div className="ml-6 border-l border-border pl-2">
          {node.children.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              parentId={node.id}
              siblings={node.children}
              maxLevel={maxLevel}
              onCreate={onCreate}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onReorderSiblings={onReorderSiblings}
            />
          ))}
          {onReorderSiblings != null && (
            <SiblingEndDropZone
              parentId={node.id}
              siblingIds={node.children.map((c) => c.id)}
              onReorderSiblings={onReorderSiblings}
            />
          )}
        </div>
      )}

      {adding && (
        <div className="ml-6 flex items-center gap-2 border-l border-border py-1 pl-4">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="名称"
            className="h-7 flex-1 rounded border border-border bg-background px-2 text-sm outline-none focus:border-ring"
            autoFocus
          />
          <input
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="描述"
            className="h-7 w-32 rounded border border-border bg-background px-2 text-sm outline-none focus:border-ring"
          />
          <button
            onClick={handleCreate}
            disabled={loading}
            className="flex h-6 w-6 items-center justify-center rounded text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => {
              setAdding(false);
              setNewName("");
              setNewDesc("");
            }}
            className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-secondary"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

export function TreeManager({
  tree,
  maxLevel = 4,
  onCreate,
  onUpdate,
  onDelete,
  onReorderSiblings,
}: TreeManagerProps) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreateRoot() {
    if (!newName.trim()) return;
    setLoading(true);
    try {
      await onCreate(newName.trim(), newDesc.trim(), null, 1);
      setAdding(false);
      setNewName("");
      setNewDesc("");
    } catch {
      /* handled by parent */
    }
    setLoading(false);
  }

  return (
    <div className="space-y-1">
      {tree.map((node) => (
        <TreeNodeItem
          key={node.id}
          node={node}
          parentId={null}
          siblings={tree}
          maxLevel={maxLevel}
          onCreate={onCreate}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onReorderSiblings={onReorderSiblings}
        />
      ))}
      {onReorderSiblings != null && (
        <SiblingEndDropZone parentId={null} siblingIds={tree.map((n) => n.id)} onReorderSiblings={onReorderSiblings} />
      )}

      {adding ? (
        <div className="flex items-center gap-2 py-1">
          <span className="h-6 w-6" />
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="名称"
            className="h-7 flex-1 rounded border border-border bg-background px-2 text-sm outline-none focus:border-ring"
            autoFocus
          />
          <input
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="描述"
            className="h-7 w-32 rounded border border-border bg-background px-2 text-sm outline-none focus:border-ring"
          />
          <button
            onClick={handleCreateRoot}
            disabled={loading}
            className="flex h-6 w-6 items-center justify-center rounded text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => {
              setAdding(false);
              setNewName("");
              setNewDesc("");
            }}
            className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-secondary"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
          )}
        >
          <Plus className="h-4 w-4" />
          添加一级项目
        </button>
      )}
    </div>
  );
}
