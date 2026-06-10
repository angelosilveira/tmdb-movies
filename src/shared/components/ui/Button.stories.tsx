import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/shared/components/ui/Button';

const meta: Meta<typeof Button> = {
  title: 'Design System/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Adicionar aos Favoritos' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Ver Detalhes' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Cancelar' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'Remover dos Favoritos' },
};

export const Loading: Story = {
  args: { variant: 'primary', children: 'Carregando...', isLoading: true },
};

export const Disabled: Story = {
  args: { variant: 'primary', children: 'Desabilitado', disabled: true },
};

export const Small: Story = {
  args: { variant: 'primary', children: 'Small', size: 'sm' },
};

export const Large: Story = {
  args: { variant: 'primary', children: 'Large', size: 'lg' },
};

export const FullWidth: Story = {
  args: { variant: 'primary', children: 'Botão Largo', fullWidth: true },
  parameters: { layout: 'padded' },
};

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    children: 'Favoritar',
    leftIcon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
};
