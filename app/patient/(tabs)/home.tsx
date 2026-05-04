import { NotificationIcon } from '@/assets/icons/common_icon/Notification';
import { RightArrowIcon } from '@/assets/icons/common_icon/RightArrowIcon';
import { AntenatalIcon } from '@/assets/icons/patient_icon/AntenatalIcon';
import { GeneralIcon } from '@/assets/icons/patient_icon/GenaralIcon';
import { PediatricIcon } from '@/assets/icons/patient_icon/PediatricIcon';
import { VaccinesIcon } from '@/assets/icons/patient_icon/VaccinesIcon';
import PageLoader from '@/components/shared/PageLoader';
import { Caption1, H3, H6 } from '@/components/typo/Typography';
import { DOCTORS, QUICK_ACTIONS, SERVICE_NAMES } from '@/constants/fakeData';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import { usePageLoader } from '@/hooks/usePageLoader';
import { getImageSource } from '@/utils/imageSource';
import { hp, wp } from '@/utils/responsiveDevice';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const QUICK_ACTION_ROUTES: Record<string, string> = {
  '1': '/patient/quick_access/general',
  '2': '/patient/quick_access/queue_status',
  '3': '/patient/quick_access/vaccine_stock',
  '4': '/patient/quick_access/ic_verification',
};

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  '1': <GeneralIcon />,
  '2': <PediatricIcon />,
  '3': <AntenatalIcon />,
  '4': <VaccinesIcon />,
  '5': <GeneralIcon />,
  '6': <AntenatalIcon />,
};

export default function HomeScreen() {
  const servicesScrollRef = useRef<ScrollView>(null);
  const doctorsListRef = useRef<FlatList>(null);
  const { loading, navigate } = usePageLoader();
  const router = useRouter();

  const handleServicesArrow = () => {
    servicesScrollRef.current?.scrollTo({ x: 200, animated: true });
  };

  const handleDoctorsArrow = () => {
    doctorsListRef.current?.scrollToOffset({ offset: 200, animated: true });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

      <PageLoader visible={loading} />

      {/* ── Sticky Header ── */}
      <View style={styles.stickyTop}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image source={IMAGE_COMPONENTS.logo} style={styles.logo} />
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigate('/patient/notification')}
            >
              <NotificationIcon />
            </TouchableOpacity>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?u=user' }}
              style={styles.avatar}
            />
          </View>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search doctors or service"
              placeholderTextColor="#999"
              style={styles.searchInput}
            />
            <TouchableOpacity
              style={styles.searchBtn}
              onPress={() => navigate('/patient/(tabs)/search')}
            >
              <H6 color='#F4F4F4'>Search</H6>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* ── Quick Actions Grid ── */}
        <View style={styles.gridContainer}>
          {QUICK_ACTIONS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.gridItem}
              activeOpacity={0.75}
              onPress={() => navigate(QUICK_ACTION_ROUTES[item.id])}
            >
              <H6 style={styles.gridText}>{item.title}</H6>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Services Section ── */}
        <View style={styles.sectionHeader}>
          <H3 style={styles.sectionTitle}>Services</H3>
          <TouchableOpacity onPress={handleServicesArrow} activeOpacity={0.7}>
            <RightArrowIcon />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={servicesScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.servicesList}
        >
          {SERVICE_NAMES.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.serviceCard}
              activeOpacity={0.8}
              onPress={() => router.push({
                pathname: '/patient/services/service_detail' as any,
                params: { serviceId: item.id },
              })}
            >
              <View style={styles.serviceIconContainer}>
                <View style={styles.serviceIconWrapper}>
                  {SERVICE_ICONS[item.id]}
                </View>
                <H6 style={styles.serviceName}>{item.name}</H6>
                <Caption1 style={styles.serviceSubtitle}>{item.subtitle}</Caption1>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Doctors Section ── */}
        <View style={styles.sectionHeader}>
          <H3 style={styles.sectionTitle}>Doctors</H3>
          <TouchableOpacity onPress={handleDoctorsArrow} activeOpacity={0.7}>
            <RightArrowIcon />
          </TouchableOpacity>
        </View>

        <FlatList
          ref={doctorsListRef}
          data={DOCTORS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.doctorsList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.doctorCard}
              activeOpacity={0.85}
              onPress={() => router.push({
                pathname: '/patient/doctors_info/doctor_details' as any,
                params: { doctorId: item.id },
              })}
            >
              <Image source={getImageSource(item.image)} style={styles.doctorImage} />
              <View style={styles.doctorInfo}>
                <H6 style={styles.doctorName} numberOfLines={1}>{item.name}</H6>
                <Caption1 style={styles.doctorSpec} numberOfLines={2}>
                  {item.fullSpecialty}
                </Caption1>
              </View>
            </TouchableOpacity>
          )}
        />

      </ScrollView>

      {/* ── KNC Float Button ── */}
      <TouchableOpacity
        style={styles.kncFloatBtn}
        onPress={() => navigate('/patient/message')}
        activeOpacity={0.85}
      >
        <Image
          source={IMAGE_COMPONENTS.contactLogo}
          style={styles.kncImage}
          resizeMode="cover"
        />
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // ── Sticky Top ──
  stickyTop: {
    backgroundColor: Colors.APP_BACKGROUND,
    paddingHorizontal: wp(20),
    paddingTop: hp(10),
    paddingBottom: hp(12),
    zIndex: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(10),
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    height: hp(54),
    width: wp(138),
    resizeMode: 'contain',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 52,
    width: 52,
    marginRight: wp(12),
    backgroundColor: '#F8F8F8',
    borderRadius: 26,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },

  // ── Search ──
  searchSection: {
    marginTop: hp(20),
  },
  searchContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.CARD_BORDER,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: wp(15),
    paddingVertical: hp(14),
    fontSize: 14,
    color: '#333',
  },
  searchBtn: {
    backgroundColor: Colors.BRAND_PRIMARY,
    paddingHorizontal: wp(20),
    justifyContent: 'center',
    borderRadius: 14,
    margin: 4,
  },

  // ── Scroll ──
  scrollContent: {
    paddingHorizontal: wp(20),
    paddingTop: hp(10),
    paddingBottom: hp(100),
  },

  // ── Quick Actions ──
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: hp(20),
    gap: 12,
  },
  gridItem: {
    width: '47.5%',
    backgroundColor: '#F8F8F8',
    borderRadius: 14,
    paddingVertical: hp(20),
    paddingHorizontal: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  gridText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.BRAND_PRIMARY,
    textAlign: 'center',
    lineHeight: 18,
  },

  // ── Section Header ──
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(28),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },

  // ── Services ──
  servicesList: {
    paddingTop: hp(14),
    paddingBottom: hp(4),
    gap: 14,
  },
  serviceCard: {
    alignItems: 'center',
  },
  serviceIconContainer: {
    width: wp(110),
    height: hp(140),
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(8),
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  serviceIconWrapper: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(8),
  },
  serviceName: {
    color: Colors.BRAND_PRIMARY,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 12,
  },
  serviceSubtitle: {
    color: '#888888',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 4,
  },

  // ── Doctors ──
  doctorsList: {
    paddingTop: hp(12),
    paddingBottom: hp(50),
    gap: 14,
  },
  doctorCard: {
    width: 155,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  doctorImage: {
    width: '100%',
    height: hp(180),
    backgroundColor: '#1D9E7533',
  },
  doctorInfo: {
    padding: 10,
  },
  doctorName: {},
  doctorSpec: {
    fontSize: 11,
    color: '#888888',
    marginVertical: 3,
  },

  // ── KNC Float ──
  kncFloatBtn: {
    position: 'absolute',
    bottom: hp(110),
    right: wp(20),
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.20,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  kncImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});