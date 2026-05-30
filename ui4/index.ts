import { h } from 'preact';
import type { ComponentChildren } from 'preact';
import { add } from '@fluxio/core';

// Example Button component
export interface ButtonProps {
  children: ComponentChildren;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export function Button({ children, onClick, variant = 'primary', size = 'md' }: ButtonProps) {
  const className = `btn btn-${variant} btn-${size}`;

  return h('button', { className, onClick }, children);
}

// Example Card component
export interface CardProps {
  title?: string;
  children: ComponentChildren;
}

export function Card({ title, children }: CardProps) {
  return h('div', { className: 'card bg-base-100 shadow-xl' },
    h('div', { className: 'card-body' },
      title && h('h2', { className: 'card-title' }, title),
      children
    )
  );
}

// Test that @fluxio/core import works
console.log('Testing @fluxio/core:', add(1, 2));
