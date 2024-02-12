import React, { useEffect, useState } from 'react';
import { useTranslation } from 'i18next-config';
import { Col, CustomInput, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledButtonDropdown } from 'reactstrap';
import { AssessmentQuestionOptions } from 'types/form';
import { useFieldArray } from 'react-hook-form';
import Delete from '@/assets/images/icons/Delete.svg';
import Copy from '@/assets/images/icons/Copy.svg';
import Add from '@/assets/images/icons/add-icon.svg';
import Close from '@/assets/images/icons/Close.svg';
import Photo from '@/assets/images/icons/Add-photo.svg';
import Short from '@/assets/images/icons/Short-answer.svg';
import Long from '@/assets/images/icons/Long-answer.svg';
import { LONG_ANSWER, MULTIPLE_CHOICE, SHORT_ANSWER } from '@/shared/constant/questions';

interface IQuestionProps {
  register: any;
  control: any;
  length: number;
  watch: (name: string) => any;
  insert: (index: number, assessment: any) => any;
  updateOption: any;
  errors: any;
  indexOption?: number | undefined;
  removeOption: (index: number) => any;
  assessmentQuestionOptions: AssessmentQuestionOptions;
}
const QuestionBox = (props: IQuestionProps) => {
  const [t] = useTranslation('home');
  const {
    watch,
    updateOption,
    register,
    errors,
    length,
    removeOption,
    control,
    insert,
    assessmentQuestionOptions: { assessmentType },
    indexOption = 0,
  } = props;
  const { fields, append, remove } = useFieldArray({
    control,
    name: `assessmentQuestionOptions[${indexOption}].questionOptionContents`,
  });
  const [optionList, setOptionList] = useState([]);
  const getNewAssessment = (type: string): AssessmentQuestionOptions => {
    return {
      assessmentContent: '',
      assessmentType: type,
      questionOptionContents: [],
      required: false,
    };
  };
  const checked = () => {
    updateOption(indexOption, {
      assessmentContent: watch(`assessmentQuestionOptions[${indexOption}].assessmentContent`),
      assessmentType: watch(`assessmentQuestionOptions[${indexOption}].assessmentType`),
      questionOptionContents: watch(`assessmentQuestionOptions[${indexOption}].questionOptionContents`),
      required: !watch(`assessmentQuestionOptions[${indexOption}].required`),
    });
  };

  const copyAssessment = () => {
    insert(indexOption + 1, {
      assessmentContent: watch(`assessmentQuestionOptions[${indexOption}].assessmentContent`),
      assessmentType: watch(`assessmentQuestionOptions[${indexOption}].assessmentType`),
      questionOptionContents: watch(`assessmentQuestionOptions[${indexOption}].questionOptionContents`),
      required: watch(`assessmentQuestionOptions[${indexOption}].required`),
    });
  };

  const changeType = (type: string) => {
    let array: any = [];
    if (type === MULTIPLE_CHOICE) {
      array = optionList;
    } else {
      setOptionList([]);
      setOptionList(watch(`assessmentQuestionOptions[${indexOption}].questionOptionContents`));
    }
    updateOption(indexOption, {
      assessmentContent: watch(`assessmentQuestionOptions[${indexOption}].assessmentContent`),
      assessmentType: type,
      questionOptionContents: array,
      required: watch(`assessmentQuestionOptions[${indexOption}].required`),
    });
  };
  useEffect(() => {
    if (fields.length === 0 && watch(`assessmentQuestionOptions[${indexOption}].assessmentType`) === MULTIPLE_CHOICE) {
      append('');
    }
  }, []);
  const getQuestion = () => {
    switch (assessmentType) {
      case MULTIPLE_CHOICE:
        return (
          <>
            <div className="option-item">
              {fields?.map((item: any, index: any) => (
                <React.Fragment key={item.id}>
                  <Row className="option-item-box">
                    <Col xs={12} sm={10} md={10} lg={10}>
                      <span className="icon-option" />
                      <input
                        {...register(`assessmentQuestionOptions[${indexOption}].questionOptionContents[${index}]`)}
                        className="input-text-option"
                        placeholder={`${t('option')} ${index + 1}`}
                      />
                    </Col>
                    <Col xs={12} sm={2} md={2} lg={2}>
                      {fields.length !== 1 && <img src={Close} onClick={() => remove(index)} className="remove-content" alt="closed" />}
                    </Col>
                  </Row>
                  <div className="error-option">
                    {errors.assessmentQuestionOptions &&
                      errors.assessmentQuestionOptions[indexOption] &&
                      errors.assessmentQuestionOptions[indexOption]?.questionOptionContents &&
                      errors.assessmentQuestionOptions[indexOption]?.questionOptionContents[index] && (
                        <span className="color-message pl-2 pr-2 ml-2 error-ws">
                          {t(errors.assessmentQuestionOptions[indexOption].questionOptionContents[index].message || '')}
                        </span>
                      )}
                  </div>
                </React.Fragment>
              ))}
            </div>
            {errors.assessmentQuestionOptions &&
              errors.assessmentQuestionOptions[indexOption] &&
              errors.assessmentQuestionOptions[indexOption]?.questionOptionContents && (
                <p className="color-message pl-2 pr-1 ml-4">
                  {t(errors.assessmentQuestionOptions[indexOption].questionOptionContents.message || '')}
                </p>
              )}
            <div className="option-item">
              <span className="icon-option" onClick={() => append('')} />
              <p className="text-option">
                {t('add_option_or')}
                <span className="text-add-other" onClick={() => append('')}>
                  {t('add_other')}
                </span>
              </p>
            </div>
          </>
        );
      case LONG_ANSWER:
        return <input type="text" className="long-input" placeholder={t('long_answer_text')} readOnly />;
      default:
        return <input type="text" className="short-input" placeholder={t('short_answer_text')} readOnly />;
    }
  };
  const getType = () => {
    switch (assessmentType) {
      case MULTIPLE_CHOICE:
        return (
          <>
            <span className="icon-outer-circle">
              <span className="icon-inner-circle"></span>
            </span>
            {t('multiple_choice')}
          </>
        );
      case LONG_ANSWER:
        return (
          <>
            <img src={Long} className="type-form-icon" alt="long answer" />
            <span className="type-form-item">{t('long_answer')}</span>
          </>
        );
      default:
        return (
          <>
            <img src={Short} className="type-form-icon" alt="short answer" />
            <span className="type-form-item">{t('short_answer')}</span>
          </>
        );
    }
  };

  return (
    <div className="box-add-option">
      <Row className="option-item-box">
        <Col xs={12} sm={7} md={7} lg={7}>
          <input
            {...register(`assessmentQuestionOptions[${indexOption}].assessmentContent`)}
            className="add-question-input"
            placeholder={t('untitled_question_active')}
          />
          <div className="mh-0">
            {errors.assessmentQuestionOptions && errors.assessmentQuestionOptions[indexOption]?.assessmentContent && (
              <span className="color-message">{t(errors.assessmentQuestionOptions[indexOption].assessmentContent.message || '')}</span>
            )}
          </div>
        </Col>
        <Col xs={12} sm={5} md={5} lg={5} className="box-type-form">
          <UncontrolledButtonDropdown>
            <DropdownToggle tag="a">
              <div className="btn-type-form ml-sm-0 btn-type-md">{getType()}</div>
            </DropdownToggle>
            <DropdownMenu right>
              {assessmentType !== SHORT_ANSWER && (
                <DropdownItem onClick={() => changeType(SHORT_ANSWER)}>
                  <img src={Short} className="type-form-icon" alt="short answer" />
                  <span className="type-form-item">{t('short_answer')}</span>
                </DropdownItem>
              )}
              {assessmentType !== LONG_ANSWER && (
                <DropdownItem onClick={() => changeType(LONG_ANSWER)}>
                  <img src={Long} className="type-form-icon" alt="long answer" />
                  <span className="type-form-item">{t('long_answer')}</span>
                </DropdownItem>
              )}
              {assessmentType !== MULTIPLE_CHOICE && (
                <DropdownItem onClick={() => changeType(MULTIPLE_CHOICE)}>
                  <span className="type-form-item">
                    <span className="icon-outer-circle">
                      <span className="icon-inner-circle" />
                    </span>
                    {t('multiple_choice')}
                  </span>
                </DropdownItem>
              )}
            </DropdownMenu>
          </UncontrolledButtonDropdown>
        </Col>
      </Row>
      <div className="option-list">{getQuestion()}</div>
      <div className="footer-form-create">
        <div className="box-action">
          <img src={Add} onClick={() => insert(indexOption + 1, getNewAssessment(assessmentType || ''))} className="pr-2" alt="add" />
          <img src={Copy} onClick={() => copyAssessment()} alt="add" />
          {length !== 1 && <img src={Delete} onClick={() => removeOption(indexOption)} alt="add" />}
        </div>
        <div className="box-required">
          <span className="required-text">
            {t('required')}
            <CustomInput
              className="switch-toggle-form"
              id={indexOption || 0}
              onChange={() => checked()}
              checked={watch(`assessmentQuestionOptions[${indexOption}].required`)}
              type="switch"
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuestionBox;
