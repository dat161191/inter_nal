type Group = {
  id?: number;
  name?: string;
  groupLogo?: string;
  userAvatars?: string[];
  type?: string;
  task?: number;
  description?: string;
};
type Member = {
  id?: number;
  name?: string;
  avatar?: string;
  position?: string;
  fullName?: string;
  type?: string;
};
type MembersType = {
  id: number;
  fullName: string;
  type?: string;
  userAvatar?: string;
};
type Position = {
  id: string;
  type: string;
};

export type { Group, Member, MembersType, Position };
