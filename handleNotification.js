import React, { useEffect, useRef, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Platform, StyleSheet, ScrollView } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, filter } from 'lodash';

import { AppFooter, AppHeader, Container, TabBar, Popup, NotificationPopup } from '@/components';
import { FcmService, PushNotificationConfig } from '@/config/push-notification';
import { NAVIGATION, TEAM_TYPE, NOTIFICATION_TYPE } from '@/config/constants';
import injectRedux from '@/config/redux/profile/injectRedux';
import profileActions from '@/config/redux/profile/actions';
import { WsNotificationClient } from '@/config/ws-service';
import * as Navigate from '@/config/navigation/Navigate';
import { LockerRoomNavigator } from './LockerRoomNavigator';
import { LockerRoomNavigatorFree } from './LockerRoomNavigatorFree';
import { PlayersNavigator } from './PlayersNavigator';
import { ScoreNavigator } from './ScoreNavigator';
import { HomeNavigator } from './HomeNavigator';
import { ShopNavigator } from './ShopNavigator';
import { GameNavigator } from './GameNavigator';

const Tab = createMaterialTopTabNavigator();

const AppNavigator = ({ data }) => {
  const fcmService = useRef(null);
  const wsSocket = useRef(null);
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);

  const { submitted, notificationList, nextPage, loadingNotification, currentUser, readNotification } = useSelector(state => ({
    readNotification: state.Profile.ProfileReadNotification.get('created'),
    loadingNotification: state.Profile.ProfileNotification.get('fetching'),
    notificationList: state.Profile.ProfileNotification.get('entities'),
    nextPage: state.Profile.ProfileNotification.get('nextPage'),
    submitted: state.Profile.ProfileInfoFirebase.get('updated'),
    currentUser: state.Profile.ProfileInfoMe.get('entity'),
  }));

  const onSetVisible = (status = true) => {
    setVisible(status);
  };

  const getData = isNext => {
    const page = isNext ? nextPage : 1;
    const params = { page };
    dispatch(profileActions.profileNotification.fetch.request(params));
  };

  const onPressBell = () => {
    dispatch(profileActions.profileReadNotification.create.request({}));
    getData();
    onSetVisible();
  };

  const onPressNotification = dataNotification => {
    onSetVisible(false);
    if (!dataNotification.entity_type_id) return;
    switch (dataNotification.entity_type_id && parseInt(dataNotification.entity_type_id, 10)) {
      case NOTIFICATION_TYPE.CreateNews:
        Navigate.navigate(NAVIGATION.newsDetail, { id: parseInt(dataNotification.entity_id, 10) });
        break;
      case NOTIFICATION_TYPE.StartMatch:
        Navigate.navigate(NAVIGATION.gameReport, { id: parseInt(dataNotification.entity_id, 10) });
        break;
      case NOTIFICATION_TYPE.FinishMatch:
        Navigate.navigate(NAVIGATION.gameResult, { id: parseInt(dataNotification.entity_id, 10) });
        break;
      default:
        Navigate.navigate(NAVIGATION.profile);
        break;
    }
  };

  const onNotification = dataNotification => {
    if (Platform.OS === 'ios') {
      dataNotification.title = dataNotification.notification.title;
      dataNotification.message = dataNotification.notification.body;
      dataNotification.id = dataNotification.messageId;
      dataNotification.userInfo = dataNotification.data;
      PushNotification.localNotification(dataNotification);
    }
  };

  const initWsSocket = () => {
    wsSocket.current && wsSocket.current.disconnect();
    wsSocket.current = new WsNotificationClient(onReceiver, `notification-user-${currentUser.id}`);
  };

  const onReceiver = () => {
    dispatch(profileActions.profileInfoMe.updateProfileMe({ ...currentUser, is_seen_notificatons: false }));
  };

  useEffect(async () => {
    PushNotificationConfig.config();
    fcmService.current = new FcmService();
    fcmService.current.createNotification(onNotification, onPressNotification);
    if (fcmService.current) {
      const device_token = await fcmService.current.getToken();
      dispatch(profileActions.profileInfoFirebase.update.request(null, { device_token, device_type: Platform.OS }));
    }
    getData();
    return () => {
      dispatch(profileActions.profileInfoFirebase.update.cleanup());
      wsSocket.current && wsSocket.current.disconnect();
      setVisible(false);
    };
  }, []);

  useEffect(() => {
    if (currentUser) initWsSocket();
  }, [currentUser]);

  useEffect(() => {
    dispatch(profileActions.profileInfoFirebase.update.cleanup());
  }, [submitted]);

  useEffect(() => {
    if (readNotification) {
      dispatch(profileActions.profileReadNotification.create.cleanup());
      dispatch(profileActions.profileInfoMe.updateProfileMe({ ...currentUser, is_seen_notificatons: true }));
    }
  }, [readNotification]);

  const checkTeamUser =
    !isEmpty(data.teams) && filter(data.teams, item => item.type !== TEAM_TYPE.Master)[0]
      ? { uri: filter(data.teams, item => item.type !== TEAM_TYPE.Master)[0]?.avatar }
      : null;

  return (
    <Container>
      <AppHeader isReadAll={currentUser && currentUser.is_seen_notificatons} onPressBell={onPressBell} />
      <Tab.Navigator tabBar={props => <TabBar {...props} />} swipeEnabled={false}>
        <Tab.Screen name={NAVIGATION.homeNavigator} options={{ tabBarLabel: 'HOME' }} component={HomeNavigator} />
        <Tab.Screen name={NAVIGATION.gameNavigator} options={{ tabBarLabel: '試合' }} component={GameNavigator} />
        <Tab.Screen name={NAVIGATION.playerNavigator} options={{ tabBarLabel: '選手名鑑' }} component={PlayersNavigator} />
        {checkTeamUser ? (
          <Tab.Screen name={NAVIGATION.lockerRoomNavigator} options={{ tabBarLabel: 'ロッカールーム' }} component={LockerRoomNavigator} />
        ) : (
          <Tab.Screen
            name={NAVIGATION.lockerRoomNavigator}
            options={{ tabBarLabel: 'ロッカールーム' }}
            component={LockerRoomNavigatorFree}
          />
        )}
        <Tab.Screen name={NAVIGATION.scoreNavigator} options={{ tabBarLabel: 'スコア入力' }} component={ScoreNavigator} />
        <Tab.Screen name={NAVIGATION.shopNavigator} options={{ tabBarLabel: 'ショップ' }} component={ShopNavigator} />
      </Tab.Navigator>
      <AppFooter userInfo={data} />
      <Popup stylePopup={styles.popupStyle} contentStyle={styles.popupInput} onSetVisible={onSetVisible} title="通知一覧" show={visible}>
        <ScrollView>
          <NotificationPopup
            nextPage={nextPage}
            onPressLoadMoreNotification={() => getData(true)}
            loadingNotification={loadingNotification}
            onPressNotification={onPressNotification}
            notificationList={notificationList}
          />
        </ScrollView>
      </Popup>
    </Container>
  );
};

export const styles = StyleSheet.create({
  popupStyle: {
    width: '90%',
    maxHeight: '70%',
  },
  popupInput: {
    padding: 20,
  },
});

export default injectRedux(AppNavigator);
