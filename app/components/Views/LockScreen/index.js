/* eslint-disable import/no-commonjs */
import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Dimensions,
  Animated,
  View,
  AppState,
  Appearance,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LottieView from 'lottie-react-native';
import { baseStyles } from '../../../styles/common';
import Logger from '../../../util/Logger';
// import { trackErrorAsAnalytics } from '../../../util/analyticsV2';
import { Authentication } from '../../../core';
import {
  getAssetFromTheme,
  mockTheme,
  ThemeContext,
} from '../../../util/theme';
import Routes from '../../../constants/navigation/Routes';

const LOGO_SIZE = 175;
const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background.default,
      flex: 1,
    },
    metamaskName: {
      marginTop: 10,
      height: 25,
      width: 170,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoWrapper: {
      marginTop: Dimensions.get('window').height / 2 - LOGO_SIZE / 2,
      height: LOGO_SIZE,
    },
    foxAndName: {
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    animation: {
      width: 110,
      height: 110,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    fox: {
      width: 110,
      height: 110,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

const wordmarkLight = require('../../../animations/wordmark-light.json');
const wordmarkDark = require('../../../animations/wordmark-dark.json');

/**
 * Main view component for the Lock screen
 */
class LockScreen extends PureComponent {
  static propTypes = {
    /**
     * The navigator object
     */
    navigation: PropTypes.object,
    selectedAddress: PropTypes.string,
    appTheme: PropTypes.string,
    route: PropTypes.object,
  };

  state = {
    ready: false,
  };

  locked = true;
  timedOut = false;
  firstAnimation = React.createRef();
  secondAnimation = React.createRef();
  animationName = React.createRef();
  opacity = new Animated.Value(1);
  unlockAttempts = 0;
  appStateListener;

  componentDidMount() {
    this.appStateListener = AppState.addEventListener(
      'change',
      this.handleAppStateChange,
    );
  }

  handleAppStateChange = async (nextAppState) => {
    // Trigger biometrics
    if (nextAppState === 'active') {
      this.firstAnimation?.play();
      this.unlockKeychain();
    }
  };

  componentWillUnmount() {
    this.appStateListener?.remove();
  }

  lock = async () => {
    await Authentication.lockApp(false);
    this.props.navigation.navigate(Routes.ONBOARDING.LOGIN);
  };

  async unlockKeychain() {
    const { bioStateMachineId } = this.props.route.params;
    this.unlockAttempts++;
    try {
      // Retreive the credentials
      Logger.log('Lockscreen::unlockKeychain - getting credentials');
      await Authentication.appTriggeredAuth({
        selectedAddress: this.props.selectedAddress,
        bioStateMachineId,
        disableAutoLogout: true,
      });
      this.locked = false;
      this.setState({ ready: true });
      Logger.log('Lockscreen::unlockKeychain - state: ready');
      // This navigation is really only needed for when the authFlow saga is not running.
      // This is needed for when a user rejects biometrics from the LockScreen. LockScreen.unlockKeychain will run up to three times and upon success, navigation will be handled here.
      this.props.navigation.navigate(Routes.ONBOARDING.HOME_NAV, {
        screen: Routes.WALLET_VIEW,
      });
    } catch (error) {
      if (
        // Error that returns when biometrics is disabled.
        error.message.includes(
          'Password does not exist when calling SecureKeychain.getGenericPassword',
        ) ||
        // User canceled action.
        error.message.includes('User canceled the operation')
      ) {
        this.lock();
      }
      if (Platform.OS === 'android') {
        // Check if Android triggers active state after biometrics failure.
        // if (this.unlockAttempts <= 3) {
        //   this.unlockKeychain();
        // } else {
        //   trackErrorAsAnalytics(
        //     'Lockscreen: Max Attempts Reached',
        //     error?.message,
        //     `Unlock attempts: ${this.unlockAttempts}`,
        //   );
        //   this.lock();
        // }
      }
    }
  }

  onAnimationFinished = () => {
    setTimeout(() => {
      Animated.timing(this.opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        isInteraction: false,
      }).start(() => {
        this.props.navigation.navigate(Routes.ONBOARDING.HOME_NAV, {
          screen: Routes.WALLET_VIEW,
        });
      });
    }, 100);
  };

  getStyles = () => {
    const colors = this.context.colors || mockTheme.colors;
    return createStyles(colors);
  };

  renderAnimations() {
    const { appTheme } = this.props;
    const osColorScheme = Appearance.getColorScheme();
    const wordmark = getAssetFromTheme(
      appTheme,
      osColorScheme,
      wordmarkLight,
      wordmarkDark,
    );
    const styles = this.getStyles();

    if (!this.state.ready) {
      return (
        <LottieView
          // eslint-disable-next-line react/jsx-no-bind
          ref={(animation) => {
            this.firstAnimation = animation;
          }}
          style={styles.animation}
          source={require('../../../animations/bounce.json')}
        />
      );
    }

    return (
      <View style={styles.foxAndName}>
        <LottieView
          // eslint-disable-next-line react/jsx-no-bind
          ref={(animation) => {
            this.secondAnimation = animation;
          }}
          style={styles.animation}
          loop={false}
          source={require('../../../animations/fox-in.json')}
          onAnimationFinish={this.onAnimationFinished}
        />
        <LottieView
          // eslint-disable-next-line react/jsx-no-bind
          ref={(animation) => {
            this.animationName = animation;
          }}
          style={styles.metamaskName}
          loop={false}
          source={wordmark}
        />
      </View>
    );
  }

  render() {
    const styles = this.getStyles();

    return (
      <View style={[baseStyles.flexGrow, styles.container]}>
        <Animated.View style={[styles.logoWrapper, { opacity: this.opacity }]}>
          <View style={styles.fox}>{this.renderAnimations()}</View>
        </Animated.View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedAddress:
    state.engine.backgroundState.PreferencesController.selectedAddress,
  appTheme: state.user.appTheme,
});

LockScreen.contextType = ThemeContext;

export default connect(mapStateToProps)(LockScreen);
