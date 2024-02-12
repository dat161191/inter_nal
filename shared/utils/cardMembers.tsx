import React from 'react';
import { Input } from 'reactstrap';
import Image from 'next/image';
import { useTranslation } from 'i18next-config';
import { MembersType } from 'types/group';
import threeDots from '@/assets/images/icons/three_dot.svg';
import { PositionTypes } from '../constant/groupDetail';

interface ICardMembersProps {
  member: MembersType;
}
const CardMembers = (props: ICardMembersProps) => {
  const [t] = useTranslation('home');
  const { member } = props;
  const positionTypes = [
    { position: PositionTypes.MEMBER, title: t('member'), className: 'position-member' },
    { position: PositionTypes.NON_TECH, title: t('non_tech'), className: 'position-non-tech' },
    { position: PositionTypes.SM, title: t('SM'), className: 'position-sm' },
    { position: PositionTypes.APO, title: t('APO'), className: 'position-apo' },
    { position: PositionTypes.PM_PO, title: t('PM-PO'), className: 'position-pm-po' },
  ];
  const getPositonType = (value: string) => {
    const result = positionTypes.map((ele, index) => {
      if (ele.position === value) {
        return (
          <div key={index} className={`d-flex justify-content-center align-items-center ${ele.className}`}>
            {ele.title}
          </div>
        );
      }
      return null;
    });
    return result;
  };
  return (
    <div className="card-container">
      <div className="card-header-content d-flex justify-content-between align-items-center mt-1 mx-2">
        <div className="d-flex align-items-center">
          <Input className="m-0" type="radio" />
        </div>

        <div className="image-three-dot position-relative">
          <Image src={threeDots} layout="fill" className="" alt="Icon three dost" />
        </div>
      </div>

      <div className="card-avatar d-flex text-center justify-content-center mt-1">
        <div className="avatar-member">
          <img className="img-member" src={member?.userAvatar} alt="Avatar Member" />
        </div>
      </div>

      <div className="card-body card-info-member text-center">
        <p className="name-member">{member.fullName}</p>
        <div className="d-flex justify-content-center align-items-center">{member.type && getPositonType(member.type)}</div>
      </div>
    </div>
  );
};
export default CardMembers;
