import React from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'i18next-config';
import { CSelect } from '../commonSelect';
import createMemberFormSchema from '@/validations/memberFormSchema';

interface SelectField {
  positionsForm: { value?: string; label?: string };
  membersForm: { value: string; label: string }[];
}

interface IpropsModalAddMember {
  showModal?: boolean;
  setShowModal: (value: React.SetStateAction<boolean>) => void;
  addNewMember: (values: SelectField) => void;
  positionOptions: {
    value: string;
    label: string;
  }[];
  memberOptions: {
    value: string;
    label: string;
  }[];
}

const ModalAddMember = (props: IpropsModalAddMember) => {
  const schema = createMemberFormSchema();
  const [t] = useTranslation('home');

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SelectField>({
    resolver: yupResolver(schema),
  });

  const resetForm = () => {
    reset({
      membersForm: [],
      positionsForm: undefined,
    });
  };

  return (
    <>
      <Modal onClosed={resetForm} isOpen={props.showModal}>
        <ModalHeader toggle={() => props.setShowModal(!props.showModal)}>
          <span className="text-primary">{t('form_add_member')}</span>
        </ModalHeader>
        <form onSubmit={handleSubmit(props.addNewMember)}>
          <ModalBody>
            <CSelect
              name="positionsForm"
              label={t('select_label', { field: t('position') })}
              control={control}
              options={props.positionOptions}
              errorMessage={t((errors.positionsForm?.value as any)?.message, { field: t('position') }) || ''}
            />

            <CSelect
              name="membersForm"
              label={t('select_label', { field: t('member') })}
              options={props.memberOptions}
              control={control}
              isMutil={true}
              errorMessage={t((errors.membersForm as any)?.message, { field: t('member') }) || ''}
            />

            <div className="d-flex justify-content-center align-items-center pt-3">
              <Button color="secondary" className="w-25 mx-2" onClick={() => props.setShowModal(!props.showModal)}>
                {t('close')}
              </Button>
              <Button color="primary" type="submit">
                {t('add_member')}
              </Button>
            </div>
          </ModalBody>
        </form>
      </Modal>
    </>
  );
};

export default ModalAddMember;
