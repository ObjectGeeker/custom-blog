export interface BaseResponse<T> {
  code: string;
  message: string;
  data: T;
}

export interface ArticleVO {
  id: string;
  title: string;
  content: string;
  tags: string[];
  categories: string[];
  createTime: string;
  createUser: string;
  updateTime: string;
  updateUser: string;
}

export interface CategoryVO {
  id: string;
  categoryName: string;
  categoryDesc: string;
  businessLevel: number;
  path: string;
  parentId: string | null;
  /** 同级排序，越小越靠前 */
  order?: number | null;
  createTime: string;
  createUser: string;
  updateTime: string;
  updateUser: string;
  children: CategoryVO[];
}

export interface TagVO {
  id: string;
  tagName: string;
  tagDesc: string;
  businessLevel: number;
  path: string;
  parentId: string | null;
  createTime: string;
  createUser: string;
  updateTime: string;
  updateUser: string;
  children: TagVO[];
}

export interface LoginUser {
  userId: string;
  userName: string;
  email: string;
  phoneNumber: string;
  roles: string[];
}

export interface LoginResponse {
  accessToken: string;
}

export interface ArticleCreateRequest {
  title: string;
  content: string;
  tags: string[];
  categories: string[];
}

export interface ArticleUpdateRequest {
  id: string;
  title?: string;
  content?: string;
  tags?: string[];
  categories?: string[];
}

export interface ArticleQueryRequest {
  title?: string;
  tag?: string;
  category?: string;
}

export interface CategoryCreateRequest {
  /** 客户端生成的 UUID，与后端 path 拼接一致 */
  id: string;
  categoryName: string;
  categoryDesc?: string;
  businessLevel: number;
  parentId?: string;
}

export interface CategoryUpdateRequest {
  id: string;
  categoryName?: string;
  categoryDesc?: string;
  parentId?: string;
  order?: number;
}

export interface CategoryQueryRequest {
  categoryName?: string;
  businessLevel?: number;
  parentId?: string;
}

export interface TagCreateRequest {
  /** 客户端生成的 UUID，与后端 path 拼接一致 */
  id: string;
  tagName: string;
  tagDesc?: string;
  businessLevel: number;
  parentId?: string;
}

export interface TagUpdateRequest {
  id: string;
  tagName?: string;
  tagDesc?: string;
  parentId?: string;
}

export interface TagQueryRequest {
  tagName?: string;
  businessLevel?: number;
  parentId?: string;
}

export interface LoginRequest {
  loginAccount: string;
  loginVerifyCode: string;
  loginType?: string;
}

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export interface UploadFileResponse {
  fileUrl: string;
}
