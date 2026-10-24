
import "./global.css";

import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, BackHandler, StyleSheet, View } from 'react-native';

import {
  cancelGroup,
  createGroup,
  finalizeGroup,
  getGroupDetails,
} from './src/repositories/groupRepository';

import {
  getProviderById,
  getProviders,
} from './src/repositories/restaurantRepository';

import BrowseRestaurantsScreen from './src/screens/BrowseRestaurantsScreen';
import CreateGroupOrderScreen from './src/screens/CreateGroupOrderScreen';
import GroupOrderDetailsScreen from './src/screens/GroupOrderDetailsScreen';
import HomeScreen from './src/screens/HomeScreen';
import JoinGroupOrderScreen from './src/screens/JoinGroupOrderScreen';
import LoginScreen from './src/screens/LoginScreen';
import MenuScreen from './src/screens/MenuScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import OrderHistoryScreen from './src/screens/OrderHistoryScreen';
import ParticipantsInvitationsScreen from './src/screens/ParticipantsInvitationsScreen';
import ProviderDiscoveryScreen from './src/screens/ProviderDiscoveryScreen';
import RestaurantDetailsScreen from './src/screens/RestaurantDetailsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';

export default function App() {
  const [stack, setStack] = useState([
    { name: 'login', params: {} },
  ]);

  const [user, setUser] = useState(null);

  const navigate = (name, params = {}) =>
    setStack((previous) => [
      ...previous,
      { name, params },
    ]);

  const goBack = () =>
    setStack((previous) =>
      previous.length > 1
        ? previous.slice(0, -1)
        : previous
    );

  const resetTo = (name) =>
    setStack([{ name, params: {} }]);

  const replaceTop = (name, params = {}) =>
    setStack((previous) => [
      ...previous.slice(0, -1),
      { name, params },
    ]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (stack.length > 1) {
          goBack();
          return true;
        }

        return false;
      }
    );

    return () => subscription.remove();
  }, [stack.length]);

  const handleAuthenticated = (authenticatedUser) => {
    setUser(authenticatedUser);
    resetTo('home');
  };

  const handleSignOut = () => {
    setUser(null);
    resetTo('login');
  };

  const renderRoute = ({ name, params }) => {
    switch (name) {
      case 'signup':
        return (
          <SignUpScreen
            onSignUp={handleAuthenticated}
            onGoToLogin={() => resetTo('login')}
          />
        );

      case 'home':
        return (
          <HomeScreen
            user={user}
            onSearchPress={() =>
              navigate('browse', { focusSearch: true })
            }
            onCuisinePress={(cuisine) =>
              navigate('browse', { cuisine })
            }
            onBrowsePress={() => navigate('browse')}
            onProviderPress={(providerId) =>
              navigate('details', { providerId })
            }
            onGroupOrderPress={() => navigate('providers')}
            onOrderHistoryPress={() =>
              navigate('orderHistory')
            }
            onNotificationsPress={() =>
              navigate('notifications')
            }
            onProfilePress={() =>
              navigate('userProfile')
            }
            onSettingsPress={() =>
              navigate('settings')
            }
          />
        );

      case 'userProfile':
        return (
          <UserProfileScreen
            user={user}
            onBack={goBack}
            onSave={(updatedUser) => setUser(updatedUser)}
          />
        );

      case 'settings':
        return (
          <SettingsScreen
            onBack={goBack}
            onSignOut={handleSignOut}
          />
        );

      case 'browse':
        return (
          <BrowseRestaurantsScreen
            initialCuisine={params.cuisine ?? null}
            autoFocusSearch={Boolean(params.focusSearch)}
            onBack={goBack}
            onProviderPress={(providerId) =>
              navigate('details', { providerId })
            }
          />
        );

      case 'details':
        return (
          <RestaurantDetailsScreen
            providerId={params.providerId}
            onBack={goBack}
            onViewMenu={(providerId) =>
              navigate('menu', { providerId })
            }
          />
        );

      case 'menu':
        return (
          <MenuScreen
            providerId={params.providerId}
            onBack={goBack}
          />
        );

      case 'providers':
        return (
          <ProviderDiscoveryScreen
            currentUser={user}
            providers={getProviders()}
            onBack={goBack}
            onJoinPress={() => navigate('joinGroup')}
            onProviderPress={(provider) =>
              navigate('details', {
                providerId: provider.providerId,
              })
            }
            onStartGroup={(provider) =>
              navigate('createGroup', {
                providerId: provider.providerId,
              })
            }
          />
        );

      case 'joinGroup':
        return (
          <JoinGroupOrderScreen
            user={user}
            onBack={goBack}
            onJoined={(groupCode) =>
              replaceTop('groupDetails', { groupCode })
            }
          />
        );

      case 'groupDetails': {
        const group = getGroupDetails(params.groupCode);

        const refresh = () =>
          setStack((previous) => [...previous]);

        return (
          <GroupOrderDetailsScreen
            group={group}
            currentUserId={user?.userId}
            onBack={goBack}
            onViewMenu={() =>
              navigate('menu', {
                providerId: group?.providerId,
              })
            }
            onViewParticipants={() =>
              navigate('participants', {
                groupCode: params.groupCode,
              })
            }
            onFinalize={() => {
              const { error } = finalizeGroup(
                params.groupCode,
                user
              );

              if (error) {
                Alert.alert('Could not finalize', error);
              } else {
                refresh();
              }
            }}
            onCancel={() => {
              const { error } = cancelGroup(
                params.groupCode,
                user
              );

              if (error) {
                Alert.alert('Could not cancel', error);
              } else {
                refresh();
              }
            }}
          />
        );
      }

      case 'participants':
        return (
          <ParticipantsInvitationsScreen
            group={getGroupDetails(params.groupCode)}
            currentUserId={user?.userId}
            onBack={goBack}
          />
        );

      case 'orderHistory':
        return (
          <OrderHistoryScreen
            onBack={goBack}
            onReorder={(order) => {
              Alert.alert(
                'Reorder',
                `You selected your order from ${order.restaurant}.`
              );
            }}
          />
        );

      case 'notifications':
        return (
          <NotificationsScreen onBack={goBack} />
        );

      case 'createGroup':
        return (
          <CreateGroupOrderScreen
            providerId={params.providerId}
            provider={getProviderById(params.providerId)}
            onBack={goBack}
            onCreate={(groupData) => {
              const group = createGroup({
                ...groupData,
                organizer: user,
              });

              replaceTop('groupDetails', {
                groupCode: group.code,
              });
            }}
          />
        );

      case 'login':
      default:
        return (
          <LoginScreen
            onLogin={handleAuthenticated}
            onGoToSignUp={() => resetTo('signup')}
          />
        );
    }
  };

  return (
    <>
      {stack.map((route, index) => (
        <View
          key={`${index}-${route.name}`}
          style={
            index === stack.length - 1
              ? styles.screen
              : styles.hidden
          }
        >
          {renderRoute(route)}
        </View>
      ))}

      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  hidden: {
    display: 'none',
  },
});
