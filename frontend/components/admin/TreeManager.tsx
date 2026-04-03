"use client";

import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
}

interface TreeNodeItemProps {
  node: TreeNode;
  maxLevel: number;
  onCreate: TreeManagerProps["onCreate"];
  onUpdate: TreeManagerProps["onUpdate"];
  onDelete: TreeManagerProps["onDelete"];
}

function TreeNodeItem({ node, maxLevel, onCreate, onUpdate, onDelete }: TreeNodeItemProps) {
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

  return (
    <div>
      <div className="group flex items-center gap-1 rounded-md py-1 pr-2 hover:bg-secondary">
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
              maxLevel={maxLevel}
              onCreate={onCreate}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
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

export function TreeManager({ tree, maxLevel = 4, onCreate, onUpdate, onDelete }: TreeManagerProps) {
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
          maxLevel={maxLevel}
          onCreate={onCreate}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}

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
