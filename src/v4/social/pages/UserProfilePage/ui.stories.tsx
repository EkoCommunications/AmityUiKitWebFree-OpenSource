import React from 'react';
import { UserProfilePage } from './UserProfilePage';

export default {
  title: 'v4-social/pages/UserProfilePage',
  component: UserProfilePage,
  argTypes: {
    userId: { control: { type: 'text' } },
  },
};

const Template = (args) => <UserProfilePage {...args} />;

export const Default = Template.bind({});

Default.args = {
  userId: 'Web-Test',
};
