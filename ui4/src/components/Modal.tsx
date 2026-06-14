import { Trash2Icon, SaveIcon, XIcon } from 'lucide-preact';
import { Button } from './Button';
import { type Vector2 } from '@fluxio/core/types/Vector';
import { comp, type Comp } from '../utils/comp';
import { cls } from '@fluxio/core/html/cls';
import { openPortal, PortalOptions } from './Portal';
import { stopEvent } from '@fluxio/core/html';
import { DivProps } from './types';
import { createContext } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { toVoid } from '@fluxio/core/cast';

interface ModalContextValue {
  onClose: () => void;
}

const ModalContext = createContext<ModalContextValue>({ onClose: toVoid });

export const useModalContext = () => useContext(ModalContext);

export interface ModalHeaderProps extends DivProps { }
export const ModalHeader = ({ children, ...props }: ModalHeaderProps) => {
  const { onClose } = useModalContext();
  return (
    <div {...props} class={cls('ModalHeader', props)}>
      <h3 class={cls('ModalTitle')}>{children}</h3>
      <Button class={cls('ModalCloseBtn')} icon={XIcon} onClick={onClose} />
    </div>
  )
}

export interface ModalContentProps extends DivProps { }
export const ModalContent = (props: ModalContentProps) => (
  <div {...props} class={cls('ModalContent', props)} />
)

export interface ModalActionsProps extends DivProps { }
export const ModalActions = (props: DivProps) => (
  <div {...props} class={cls('ModalActions', props)} />
)

export interface ModalProps extends DivProps {
  onClose: () => void;
}

export const Modal = ({ onClose, ...props }: ModalProps) => {
  return (
    <ModalContext.Provider value={{ onClose }}>
      <div class={cls('Modal')} onClick={onClose}>
        <div {...props} class={cls('ModalBox', props)} onClick={stopEvent} />
      </div >
    </ModalContext.Provider>
  );
};

export interface SimpleModalProps {
  size?: Vector2;
  title?: Comp;
  content?: Comp<{ onClose: () => void }>;
  onClose: () => void;
  onCancel?: () => void;
  onSave?: () => void;
  onRemove?: () => void;
  onYes?: () => void;
  onNo?: () => void;
}
export const SimpleModal = ({
  size,
  title,
  content,
  onClose,
  onCancel,
  onSave,
  onRemove,
  onYes,
  onNo,
}: SimpleModalProps) => {
  const wc = (cb?: (() => void) | null) => () => {
    cb?.();
    onClose();
  };

  const handleDelete = () => {
    openModal('Êtes-vous sûr de supprimer ?', undefined, {
      no: toVoid,
      yes: wc(onRemove),
    });
  };

  return (
    <Modal style={size ? { width: size[0], height: size[1] } : {}} onClose={onClose}>
      <ModalHeader>{title}</ModalHeader>
      <ModalContent>{content}</ModalContent>
      {(onRemove || onCancel || onNo || onSave || onYes) && (
        <ModalActions>
          {onRemove && (
            <Button title="Supprimer" icon={Trash2Icon} error onClick={handleDelete} />
          )}
          <div class="flex-1" />
          {onCancel && (
            <Button title="Annuler" icon={XIcon} ghost onClick={wc(onCancel)} />
          )}
          {onNo && (
            <Button title="Non" icon={SaveIcon} ghost onClick={wc(onNo)} />
          )}
          {onSave && (
            <Button title="Enregistrer" icon={SaveIcon} primary onClick={wc(onSave)} />
          )}
          {onYes && (
            <Button title="Oui" icon={SaveIcon} primary onClick={wc(onYes)} />
          )}
        </ModalActions>
      )}
    </Modal>
  );
}

export interface OpenModalOptions extends Omit<PortalOptions, 'size'> {
  size?: Vector2;
  cancel?: () => void;
  save?: () => void;
  remove?: () => void;
  yes?: () => void;
  no?: () => void;
}

export type ModalComp = Comp<{
  onClose?: () => void,
}>;

export const openModal = (
  title?: Comp,
  content?: ModalComp,
  { size, cancel, save, remove, yes, no, ...options }: OpenModalOptions = {}
) => {
  return openPortal(
    ({ onClose }) => (
      <SimpleModal
        size={size}
        title={title}
        content={comp(content, { onClose })}
        onClose={onClose}
        onCancel={cancel}
        onSave={save}
        onRemove={remove}
        onYes={yes}
        onNo={no}
      />
    ),
    options
  );
};