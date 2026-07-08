
import { 
  Leaf, 
  Search, 
  Activity, 
  MessageCircle, 
  User, 
  LogOut, 
  Book, 
  Users, 
  GitBranch, 
  Loader2, 
  Send, 
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  X,
  Menu,
  Plus,
  Trash2,
  History
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const LeafIcon = Leaf;
export const SearchIcon = Search;
export const ActivityIcon = Activity;
export const MessageCircleIcon = MessageCircle;
export const UserIcon = User;
export const LogOutIcon = LogOut;
export const BookIcon = Book;
export const UsersIcon = Users;
export const GitBranchIcon = GitBranch;
export const LoaderIcon = Loader2;
export const SendIcon = Send;
export const AlertCircleIcon = AlertCircle;
export const ChevronRightIcon = ChevronRight;
export const ChevronLeftIcon = ChevronLeft;
export const XIcon = X;
export const MenuIcon = Menu;
export const PlusIcon = Plus;
export const TrashIcon = Trash2;
export const HistoryIcon = History;
