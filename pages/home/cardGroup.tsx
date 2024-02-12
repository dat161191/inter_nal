import React from 'react';
import { Group } from 'types/group';
import logoGroup from 'assets/images/groupLogo.png';
import { MAX_MEMBER } from 'shared/constant/param';
import { Col, Row } from 'reactstrap';
import { useTranslation } from 'i18next-config';
import { RouterPath } from 'shared/constant/common';
import Link from 'next/dist/client/link';
import task from '@/assets/images/icons/Task.svg';
import { groupTypeConstants } from '@/redux/constants/group';

interface ICardProps {
  group: Group;
}
const CardGroup = (props: ICardProps) => {
  const [t] = useTranslation('home');
  const { group } = props;
  const groupType = (type: any): string | undefined => {
    switch (type) {
      case groupTypeConstants.PROJECT:
        return 'project';
      case groupTypeConstants.NON_TECH:
        return 'non-tech';
      default:
        return 'tech';
    }
  };
  return (
    <Link href={{ pathname: RouterPath.GroupDetail, query: { id: group.id?.toString() } }}>
      <div className="card-group">
        <Row className="w-100 group-col-flex">
          <Col xs={3} md={3}>
            <img alt="logo" className="logo-group" src={group.groupLogo || logoGroup} />
          </Col>
          <Col xs={9} md={9}>
            <p className="group-name">{group.name}</p>
            <div className="row box-member">
              {group.userAvatars?.map((user, index) =>
                index < 5 ? <img key={`${user}_${index}`} alt="avatar" src={user} className="avatar-user" /> : <></>
              )}
              {group.userAvatars && group.userAvatars.length >= 5 && <span className="overflow">+{group.userAvatars.length - 5}</span>}
            </div>
          </Col>
        </Row>
        <Row className="w-100 group-col-flex">
          <Col xs={3} md={3}>
            <p className={`group-type ${groupType(group.type)}`}>{t(group.type || '')}</p>
          </Col>
          <Col xs={9} md={9}>
            <img className="task-icon" src={task} alt="task" /> <p className="task-number">5</p>
            <span className="task-text ml-1">{t('tasks')}</span>
          </Col>
        </Row>
        <Row className="w-100">
          <Col xs={12} md={12} className="col-height">
            <hr className="group-hr" />
            <p className="group-description">{group.description}</p>
          </Col>
        </Row>
      </div>
    </Link>
  );
};

export default CardGroup;
