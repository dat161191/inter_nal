import { Col, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import React, { useState } from 'react';
import { useTranslation } from 'i18next-config';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FormTemplate } from '../../../types/formTemplate';
import { formatDate } from '@/pages/modules/format/formatDate';
import { deleteFormTemplate } from '@/redux/actions/formActions';

interface ICardFormProps {
  form: FormTemplate;
  key: any;
  canDeleteFormTemplate: boolean;
  getForms: any;
}
const CardFormTemplateMobile = (props: ICardFormProps) => {
  const { form, canDeleteFormTemplate, getForms } = props;
  const dispatch = useDispatch();
  const [t] = useTranslation('home');
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const remove = (id: number | undefined) => {
    dispatch(
      deleteFormTemplate({
        params: id,
        callback: () => {
          toggle();
          toast.success(t('delete_success'));
          getForms();
        },
        errorCallback: () => {
          toast.error(t('delete_error'));
        },
      })
    );
  };

  return (
    <div className="card-hover">
      <div className="card-form-mobile row-spacing">
        <Row>
          <Col xs={12} className="center-name">
            <div className="truncate-name">
              <span title={form?.name}>{form?.name}</span>
            </div>
          </Col>
        </Row>
        <Row className="Adjust-distance">
          <Col xs={12} className="size-text-form">
            <div className="truncate-email">
              <span title={form?.createdBy}>{form?.createdBy}</span>
            </div>
          </Col>
        </Row>
        <Row className="Adjust-distance">
          <Col xs={6} className="center-content">
            <span className=" size-text-form" title={formatDate(form.createdDate, t('format_date_time'))}>
              {formatDate(form.createdDate, t('format_date'))}
            </span>
          </Col>
          {canDeleteFormTemplate && (
            <Col xs={6}>
              <div className="btn-delete" onClick={toggle}>
                <span className="icon-delete-1" />
              </div>
            </Col>
          )}
        </Row>
      </div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>{t('delete_title')}</ModalHeader>
        <ModalBody>
          {t('form_template_list')}: {form.name}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => remove(form?.id)}>
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
export default CardFormTemplateMobile;
