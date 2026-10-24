
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
import DeliveryAddressScreen from './src/screens/DeliveryAddressScreen';
import GroupOrderDetailsScreen from './src/screens/GroupOrderDetailsScreen';
import GroupOrderSummaryScreen from './src/screens/GroupOrderSummaryScreen';
import HomeScreen from './src/screens/HomeScreen';
import JoinGroupOrderScreen from './src/screens/JoinGroupOrderScreen';
import LoginScreen from './src/screens/LoginScreen';
import MenuScreen from './src/screens/MenuScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import OrderHistoryScreen from './src/screens/OrderHistoryScreen';
import OrderTrackingScreen from './src/screens/OrderTrackingScreen';
import ParticipantsInvitationsScreen from './src/screens/ParticipantsInvitationsScreen';
import ProviderDiscoveryScreen from './src/screens/ProviderDiscoveryScreen';
import RestaurantDetailsScreen from './src/screens/RestaurantDetailsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ShoppingCartScreen from './src/screens/ShoppingCartScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';

// Custom navigation stack for the UI prototype.
export default function App() {
  const [stack, setStack] = useState([
    { name: 'login', params: {} },
  ]);

  const [user, setUser] = useState(null);

  // Student 3: temporary in-memory cart and checkout state.
  const [cartItems, setCartItems] = useState([]);
  const [isGroupOrder, setIsGroupOrder] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [activeRestaurant, setActiveRestaurant] = useState(null);

  const navigate = (name, params = {}) => {
    setStack((previous) => [
      ...previous,
      { name, params },
    ]);
  };

  const goBack = () => {
    setStack((previous) =>
      previous.length > 1
        ? previous.slice(0, -1)
        : previous
    );
  };

  const resetTo = (name) => {
    setStack([{ name, params: {} }]);
  };

  const replaceTop = (name, params = {}) => {
    setStack((previous) => [
      ...previous.slice(0, -1),
      { name, params },
    ]);
  };

  const handleAuthenticated = (authenticatedUser) => {
    setUser(authenticatedUser);
    resetTo('home');
  };

  const handleSignOut = () => {
    setUser(null);
    resetTo('login');
  };

  // Add a menu item to the cart.
  // Prices are stored as integer piasters in the mock data.
  const addToCart = (item, providerId) => {
    const provider = getProviderById(providerId);

    if (!provider || !provider.isAvailable || !item.isAvailable) {
      Alert.alert(
        'Item unavailable',
        'This item cannot be added to your order right now.'
      );
      return;
    }

    if (
      activeRestaurant &&
      activeRestaurant.providerId !== providerId &&
      cartItems.length > 0
    ) {
      Alert.alert(
        'Different restaurant',
        'Your cart already contains items from another restaurant. Clear the existing cart before ordering from a different restaurant.'
      );
      return;
    }

    setActiveRestaurant(provider);

    setCartItems((previous) => {
      const existing = previous.find(
        (line) => line.menuItemId === item.menuItemId
      );

      if (existing) {
        return previous.map((line) =>
          line.menuItemId === item.menuItemId
            ? { ...line, quantity: line.quantity + 1 }
            : line
        );
      }

      return [
        ...previous,
        {
          cartItemId: `${item.menuItemId}-${Date.now()}`,
          menuItemId: item.menuItemId,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ];
    });
  };

  const changeCartQuantity = (cartItemId, amount) => {
    setCartItems((previous) =>
      previous
        .map((line) =>
          line.cartItemId === cartItemId
            ? { ...line, quantity: line.quantity + amount }
            : line
        )
        .filter((line) => line.quantity > 0)
    );
  };

  const removeCartItem = (cartItemId) => {
    setCartItems((previous) =>
      previous.filter((line) => line.cartItemId !== cartItemId)
    );
  };

  // Android hardware back button.
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

  const renderRoute = ({ name, params }) => {
    switch (name) {
      case 'login':
        return (
          <LoginScreen
            onLogin={handleAuthenticated}
            onGoToSignUp={() => resetTo('signup')}
          />
        );

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
            onProfilePress={() => navigate('userProfile')}
            onOrderHistoryPress={() => navigate('orderHistory')}
            onNotificationsPress={() => navigate('notifications')}
            onSettingsPress={() => navigate('settings')}
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
            onViewMenu={(providerId) => {
              setIsGroupOrder(false);
              setActiveRestaurant(getProviderById(providerId));
              navigate('menu', { providerId });
            }}
          />
        );

      case 'menu':
        return (
          <MenuScreen
            providerId={params.providerId}
            onBack={goBack}
            onAddToCart={(item) =>
              addToCart(item, params.providerId)
            }
            onViewCart={() => navigate('shoppingCart')}
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
            onStartGroup={(provider) => {
              setIsGroupOrder(true);
              setActiveRestaurant(provider);
              navigate('createGroup', {
                providerId: provider.providerId,
              });
            }}
          />
        );

      case 'joinGroup':
        return (
          <JoinGroupOrderScreen
            user={user}
            onBack={goBack}
            onJoined={(groupCode) => {
              setIsGroupOrder(true);

              const group = getGroupDetails(groupCode);
              if (group) {
                setActiveRestaurant(
                  getProviderById(group.providerId)
                );
              }

              replaceTop('groupDetails', { groupCode });
            }}
          />
        );

      case 'groupDetails': {
        const group = getGroupDetails(params.groupCode);

        const refresh = () => {
          setStack((previous) => [...previous]);
        };

        return (
          <GroupOrderDetailsScreen
            group={group}
            currentUserId={user?.userId}
            onBack={goBack}
            onViewMenu={() => {
              setIsGroupOrder(true);
              setActiveRestaurant(
                getProviderById(group?.providerId)
              );
              navigate('menu', {
                providerId: group?.providerId,
              });
            }}
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

              setIsGroupOrder(true);
              setActiveRestaurant(
                getProviderById(group.providerId)
              );

              replaceTop('groupDetails', {
                groupCode: group.code,
              });
            }}
          />
        );

      // Student 3: shopping cart.
      case 'shoppingCart':
        return (
          <ShoppingCartScreen
            cartItems={cartItems}
            isGroupOrder={isGroupOrder}
            userName={user?.displayName ?? 'You'}
            restaurantName={
              activeRestaurant?.name ?? 'Your restaurant'
            }
            onBack={goBack}
            onChangeQuantity={changeCartQuantity}
            onRemoveItem={removeCartItem}
            onBrowseMenu={() => {
              if (activeRestaurant) {
                navigate('menu', {
                  providerId: activeRestaurant.providerId,
                });
              } else {
                navigate('browse');
              }
            }}
            onContinue={() => navigate('groupSummary')}
          />
        );

      // Student 3: order summary.
      case 'groupSummary':
        return (
          <GroupOrderSummaryScreen
            cartItems={cartItems}
            isGroupOrder={isGroupOrder}
            restaurantName={
              activeRestaurant?.name ?? 'Cairo Koshary House'
            }
            onBack={goBack}
            onContinue={() => navigate('deliveryAddress')}
          />
        );

      // Student 3: delivery address.
      case 'deliveryAddress':
        return (
          <DeliveryAddressScreen
            onBack={goBack}
            onConfirm={(address) => {
              setDeliveryAddress(address);
              navigate('orderTracking');
            }}
          />
        );

      // Student 3: prototype order tracking.
      case 'orderTracking':
        return (
          <OrderTrackingScreen
            address={deliveryAddress}
            onBack={goBack}
            onFinish={() => {
              setCartItems([]);
              setDeliveryAddress(null);
              setIsGroupOrder(false);
              setActiveRestaurant(null);
              resetTo('home');
            }}
          />
        );

      // Student 4: profile.
      case 'userProfile':
        return (
          <UserProfileScreen
            user={user}
            onBack={goBack}
            onSave={(updatedUser) => setUser(updatedUser)}
          />
        );

      // Student 4: settings and sign out.
      case 'settings':
        return (
          <SettingsScreen
            onBack={goBack}
            onSignOut={handleSignOut}
          />
        );

      // Student 4: order history.
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

      // Student 4: notifications.
      case 'notifications':
        return (
          <NotificationsScreen onBack={goBack} />
        );

      default:
        return (
          <LoginScreen
            onLogin={handleAuthenticated}
            onGoToSignUp={() => resetTo('signup')}
          />
        );
    }
  };

  // Keep previous screens mounted to preserve their local UI state.
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
