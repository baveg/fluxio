import type { LucideIcon } from 'lucide-preact';
import { tooltipProps } from './Tooltip';
import { type Comp } from '../utils/comp';
import { cls } from '@fluxio/core/html/cls';

export interface UploadButtonProps {
  icon?: LucideIcon;
  primary?: boolean;
  secondary?: boolean;
  xs?: boolean;
  ghost?: boolean;
  class?: string;
  title?: string;
  tooltip?: Comp;
  multiple?: boolean;
  accept?: string;
  onFiles: (files: File[]) => void;
}

export const UploadButton = ({
  icon: Icon,
  primary,
  secondary,
  xs,
  ghost,
  class: extraCls,
  title,
  tooltip,
  multiple = true,
  accept,
  onFiles,
}: UploadButtonProps) => (
  <label
    class={cls(
      'btn flex',
      primary && 'btn-primary',
      secondary && 'btn-secondary',
      xs && 'btn-xs',
      ghost && 'btn-ghost',
      Icon && !title && 'btn-square',
      extraCls
    )}
    {...tooltipProps(tooltip)}
  >
    {Icon && <Icon size={xs ? 14 : 24} />}
    {title}
    <input
      type="file"
      class="hidden"
      multiple={multiple}
      accept={accept}
      onChange={(e) => {
        const files = Array.from((e.target as HTMLInputElement).files ?? []);
        if (files.length) onFiles(files);
        (e.target as HTMLInputElement).value = '';
      }}
    />
  </label>
);
