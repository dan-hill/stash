export interface TreeNodeInterface {
  key: string;
  name: string;
  age?: number;
  level?: number;
  expand: boolean;
  address?: string;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
  icon?: string;
  isLeaf?: boolean;
}
