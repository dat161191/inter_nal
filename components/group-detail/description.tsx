import React from 'react';
import { ArrowLeft, ArrowRight, List } from 'react-feather';
import Edit from 'assets/images/icons/Edit.svg';
import Image from 'next/dist/client/image';
import { useTranslation } from 'i18next-config';

interface IDescriptionProps {
  showDescription?: boolean;
  setShowDescription: React.Dispatch<React.SetStateAction<boolean>>;
}

const Description = (props: IDescriptionProps) => {
  const link = 'http://bit.ly/2ZzjwH7';
  const groupInfo = [
    { title: 'Member info' },
    { title: 'Project folder' },
    { title: 'Feature list' },
    { title: 'Master Schedule' },
    { title: 'Redmine' },
    { title: 'Design' },
  ];
  const [t] = useTranslation('home');
  const { showDescription, setShowDescription } = props;

  return (
    <div className="description-member">
      {showDescription ? (
        <div className="right-slide">
          <div className="right-arrow d-flex justify-content-between align-items-center cursor-pointer">
            <div className="icons-edit d-flex justify-content-between align-items-center ">
              <span className="mr-2 text-description">{t('description')}</span>
              <Image src={Edit} alt="Edit icon" width={24} height={24} />
            </div>
            <div className="pe-2">
              <ArrowRight onClick={() => setShowDescription(!showDescription)} />
            </div>
          </div>
          <div className="member-description">
            <div className="pt-2">
              {groupInfo &&
                groupInfo.map((ele, index) => {
                  return (
                    <div className="pt-3" key={index}>
                      <p className="mb-1">{ele.title}:</p>
                      <div className="link-info">
                        <a href={link}>{link}</a>;
                      </div>
                    </div>
                  );
                })}
              <p className="mb-1">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perferendis temporibus nostrum nisi optio quae sapiente laborum
                sunt! Excepturi commodi eligendi asperiores. Rem laudantium ut tempora, harum ullam quibusdam iusto natus.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="left-arrow cursor-pointer d-flex justify-content-end" onClick={() => setShowDescription(!showDescription)}>
          <List />
        </div>
      )}
    </div>
  );
};
export default Description;
