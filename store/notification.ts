import { Module, VuexModule, Mutation } from 'vuex-module-decorators';

interface NotificationConfig {
  isShow: boolean;
  text: String;
  color: String;
}

@Module({
  name: 'notification',
  stateFactory: true,
  namespaced: true,
})
export default class Notification extends VuexModule {
  config: NotificationConfig = {
    isShow: false,
    text: '',
    color: '#68cd86',
  };

  @Mutation
  mutateNotification(config: NotificationConfig) {
    this.config = config;
  }

  get notificationConfig() {
    return this.config;
  }
}
