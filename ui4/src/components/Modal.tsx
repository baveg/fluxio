import { render } from 'preact';
import { useEffect } from 'preact/hooks';
import { X, Trash2, Save } from 'lucide-preact';
import { Button } from './Button';
import { type Vector2 } from '@fluxio/core/types/Vector';
import { comp, type Comp } from '../utils/comp';
import { type DivProps } from './types';
import { cls } from '@fluxio/core/html/cls';

interface ModalInstanceProps {
  size?: Vector2;
  title?: string | null;
  content?: Comp<{ onClose: () => void }>;
  onClose: () => void;
  onCancel?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  dialog: HTMLDialogElement;
}

const ModalAction = (props: DivProps) => <div {...props} class={cls('modal-action', props.class || props.className)} />;

const ModalInstance = ({
  size,
  title,
  content,
  onClose,
  onCancel,
  onSave,
  onDelete,
  dialog,
}: ModalInstanceProps) => {
  const close = () => {
    dialog.close();
    onClose();
  };

  useEffect(() => {
    dialog.showModal();
  }, [dialog]);

  const boxStyle = size && {
    width: size[0],
    height: size[1],
    maxWidth: '90vw',
    maxHeight: '90vh',
  };

  return (
    <>
      <div class={cls('modal-box bg-base-100 p-6 rounded-lg shadow-xl', size && 'max-w-none')} style={boxStyle}>
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10" onClick={close}>
          ✕
        </button>
        {title && <h3 class="font-bold text-lg mb-4 pr-8">{title}</h3>}
        {content}
        <ModalAction>
          {onDelete && (
            <>
              <Button
                title="Supprimer"
                icon={Trash2}
                error
                onClick={() => {
                  openModal('Êtes-vous sûr de supprimer ?', undefined, {
                    onSave: () => {
                      onDelete!();
                      close();
                    },
                  });
                }}
              />
              <div class="flex-1" />
            </>
          )}
          {onCancel && (
            <Button
              title="Annuler"
              icon={X}
              ghost
              onClick={() => {
                onCancel();
                close();
              }}
            />
          )}
          {onSave && (
            <Button
              title="Enregistrer"
              icon={Save}
              primary
              onClick={() => {
                onSave();
                close();
              }}
            />
          )}
        </ModalAction>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </>
  );
};

export interface OpenModalOptions {
  size?: Vector2;
  onCancel?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
}

export const openModal = (
  title?: string | null,
  content?: any | ((close: () => void) => any),
  { size, onCancel, onSave, onDelete }: OpenModalOptions = {}
) => {
  const dialog = document.createElement('dialog');
  dialog.className = 'modal modal-bottom sm:modal-middle';
  document.body.appendChild(dialog);

  const onClose = () => {
    render(null, dialog);
    dialog.remove();
  };

  render(
    <ModalInstance
      size={size}
      title={title}
      content={comp(content, { onClose })}
      onClose={onClose}
      onCancel={onCancel}
      onSave={onSave}
      onDelete={onDelete}
      dialog={dialog}
    />,
    dialog
  );
};
