import type { Meta, StoryObj } from '@storybook/react';
import { RatingBadge } from '@/shared/components/ui/RatingBadge';

const meta: Meta<typeof RatingBadge> = {
  title: 'Design System/RatingBadge',
  component: RatingBadge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    rating: { control: { type: 'range', min: 0, max: 10, step: 0.1 } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Excellent: Story = { args: { rating: 8.5, size: 'md' } };
export const Good: Story = { args: { rating: 6.8, size: 'md' } };
export const Average: Story = { args: { rating: 4.2, size: 'md' } };
export const Small: Story = { args: { rating: 7.9, size: 'sm' } };
export const Large: Story = { args: { rating: 9.1, size: 'lg' } };

export const AllRatings: Story = {
  render: () => (
    <div className="flex gap-3 items-center flex-wrap">
      <RatingBadge rating={9.5} size="md" />
      <RatingBadge rating={7.5} size="md" />
      <RatingBadge rating={6.0} size="md" />
      <RatingBadge rating={4.0} size="md" />
      <RatingBadge rating={1.5} size="md" />
    </div>
  ),
};
