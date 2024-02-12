import { Col, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import React, { useState } from 'react';
import { useTranslation } from 'i18next-config';
import { Assessments } from '../../../types/assessment';
import { formatDate } from '@/pages/modules/format/formatDate';
import { FORMAT_STRING_DATE, FORMAT_STRING_TIME } from '@/shared/constant/common';

interface ICardFormProps {
  assessments: Assessments;
  key: any;
}
const CardAssessment = (props: ICardFormProps) => {
  const { assessments } = props;
  const [t] = useTranslation('home');
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div className="card-hover">
      <div className="card-assessment row-spacing width-card">
        <Row className="width-row">
          <Col className="center-name-group" lg={5} md={4}>
            <img className="avatar-groups" src={assessments.img} alt="" />
            <div className="truncate-name-group">
              <span title={assessments?.groupName}>{assessments?.groupName}</span>
            </div>
          </Col>
          <Col className="center-content size-text-form text-center" md={2}>
            <div className="truncate-email">
              <span className="adjust-total">{assessments?.form}</span>
            </div>
          </Col>
          <Col className="center-content size-text-form" lg={2} md={3}>
            <div className="truncate-date">
              <span title={formatDate(assessments.createdDate, t('format_date_time'))}>
                {formatDate(assessments.createdDate, t('format_date'))}
              </span>
            </div>
          </Col>
          <Col className="center-content size-text-form" md={2}>
            <div className="truncate-date">
              <span title={formatDate(assessments.dueDate, t('format_date_time'))}>
                {formatDate(assessments.dueDate, t('format_date'))}
              </span>
            </div>
          </Col>
          <Col className="center-content center-icon" md={1}>
            <div onClick={toggle}>
              <span className="icon-delete-1" />
            </div>
          </Col>
        </Row>
      </div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>{t('delete_title')}</ModalHeader>
        <ModalBody>{t('assessment_name', { name: assessments.groupName })}</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>
            {t('yes')}
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>
            {t('no')}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
export default CardAssessment;
