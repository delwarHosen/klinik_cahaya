// app/patient/(tabs)/home.tsx — শুধু notification badge অংশ যোগ হয়েছে
import { NotificationIcon } from '@/assets/icons/common_icon/Notification';
import { RightArrowIcon } from '@/assets/icons/common_icon/RightArrowIcon';
import { AntenatalIcon } from '@/assets/icons/patient_icon/AntenatalIcon';
import { GeneralIcon } from '@/assets/icons/patient_icon/GenaralIcon';
import { PediatricIcon } from '@/assets/icons/patient_icon/PediatricIcon';
import { VaccinesIcon } from '@/assets/icons/patient_icon/VaccinesIcon';
import { QuickActionsGrid } from '@/components/home/QuickActionsGrid';
import { SearchBar } from '@/components/home/SearchBar';
import PageLoader from '@/components/shared/PageLoader';
import { Caption1, H3, H6 } from '@/components/typo/Typography';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import { usePageLoader } from '@/hooks/usePageLoader';
import { useRefresh } from '@/hooks/useRefresh';
import { useGetProfileQuery } from '@/redux/services/authApi';
import { useGetDoctorsQuery } from '@/redux/services/doctorsApi';
import { useGetPatientNotificationsQuery } from '@/redux/services/notificationApi';
import { useGetServicesQuery } from '@/redux/services/servicesApi';
import { hp, wp } from '@/utils/responsiveDevice';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

  const { data: doctorsData, refetch: refetchDoctors } = useGetDoctorsQuery(undefined);
  const doctors = doctorsData?.data ?? [];

  const { data: servicesData, refetch: refetchServices } = useGetServicesQuery(undefined);
  const services = servicesData?.results ?? [];
  // console.log("All services from Home:", services)

  const { data, isLoading: profileLoading, refetch: refetchProfile } = useGetProfileQuery({})
  const avatarUrl = data?.profile_picture?.public_url ?? null

  // ── Notification unread count ──────
  const { data: notifData, refetch: refetchNotif } = useGetPatientNotificationsQuery();
  const unreadCount = (notifData?.results ?? []).filter((n) => !n.is_read).length;

  const { refreshing, onRefresh } = useRefresh([
    refetchDoctors,
    refetchServices,
    refetchProfile,
    refetchNotif,
  ]);


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
            {/* Notification button with badge */}
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigate('/patient/notification')}
            >
              <NotificationIcon />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/patient/(tabs)/profile")}>
              <Image
                source={avatarUrl ? { uri: avatarUrl } : IMAGE_COMPONENTS.patient}
                style={styles.avatar}
              />
            </TouchableOpacity>

          </View>
        </View>
        <SearchBar onSearchPress={() => navigate('/patient/(tabs)/search')} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.BRAND_PRIMARY]}
            tintColor={Colors.BRAND_PRIMARY}
          />
        }
      >
        <QuickActionsGrid onItemPress={(route) => navigate(route)} />

        {/* ── Services ── */}
        <View style={styles.sectionHeader}>
          <H3 style={styles.sectionTitle}>Services</H3>
          <TouchableOpacity onPress={handleServicesArrow} activeOpacity={0.7}>
            <RightArrowIcon />
          </TouchableOpacity>
        </View>
        <ScrollView
          ref={servicesScrollRef}
          horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.servicesList}
        >
          {services.map((item: any) => (
            <TouchableOpacity
              key={item.id} style={styles.serviceCard} activeOpacity={0.8}
              onPress={() => router.push({
                pathname: '/patient/services/service_detail' as any,
                params: { serviceId: item.id },
              })}
            >
              <View style={styles.serviceIconContainer}>
                <View style={styles.serviceIconWrapper}>
                  {item.image_url ? (
                    <Image source={{ uri: item.image_url }} style={styles.serviceImage} resizeMode="contain" />
                  ) : (
                    SERVICE_ICONS[String(item.id)] ?? <GeneralIcon />
                  )}
                </View>
                <H6 style={styles.serviceName}>{item.title}</H6>
                <Caption1 style={styles.serviceSubtitle}>{item.subtitle}</Caption1>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Doctors ── */}
        <View style={styles.sectionHeader}>
          <H3 style={styles.sectionTitle}>Doctors</H3>
          <TouchableOpacity onPress={handleDoctorsArrow} activeOpacity={0.7}>
            <RightArrowIcon />
          </TouchableOpacity>
        </View>
        <FlatList
          ref={doctorsListRef}
          data={doctors} horizontal showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.doctorsList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.doctorCard} activeOpacity={0.85}
              onPress={() => router.push({
                pathname: '/patient/doctors_info/doctor_details' as any,
                params: { doctorId: item.id },
              })}
            >
              <Image source={{ uri: item.avatar_url }} style={styles.doctorImage} />
              <View style={styles.doctorInfo}>
                <H6 style={styles.doctorName} numberOfLines={1}>{item.name}</H6>
                <Caption1 style={styles.doctorSpec} numberOfLines={2}>{item.specialization}</Caption1>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>

      <TouchableOpacity
        style={styles.kncFloatBtn}
        onPress={() => navigate('/patient/message')}
        activeOpacity={0.85}
      >
        <Image source={IMAGE_COMPONENTS.contactLogo} style={styles.kncImage} resizeMode="cover" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  stickyTop: {
    backgroundColor: Colors.APP_BACKGROUND,
    paddingHorizontal: wp(20),
    paddingTop: hp(10),
    paddingBottom: hp(12),
    zIndex: 10, elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(10)
  },
  logoContainer: {
    flexDirection: 'row', alignItems: 'center'
  },
  logo: { height: hp(54), width: wp(138), resizeMode: 'contain' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: {
    justifyContent: 'center', alignItems: 'center',
    height: 52, width: 52, marginRight: wp(12),
    backgroundColor: '#F8F8F8', borderRadius: 26,
  },
  // ── Badge ──
  badge: {
    position: 'absolute',
    top: 4, right: 4,
    minWidth: 18, height: 18, borderRadius: 9,
    backgroundColor: '#FF3B30',
    justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5, borderColor: '#FFFFFF',
  },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700', lineHeight: 12 },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  scrollContent: { paddingHorizontal: wp(20), paddingTop: hp(10), paddingBottom: hp(100) },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: hp(28),
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  servicesList: { paddingTop: hp(14), paddingBottom: hp(4), gap: 14 },
  serviceCard: { alignItems: 'center' },
  serviceIconContainer: {
    width: wp(110), height: hp(140), backgroundColor: '#F8F8F8', borderRadius: 16,
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: wp(8),
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  serviceIconWrapper: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: hp(8) },
  serviceImage: { width: 40, height: 40, borderRadius: 6 },
  serviceName: { color: Colors.BRAND_PRIMARY, fontWeight: '600', textAlign: 'center', fontSize: 12 },
  serviceSubtitle: { color: '#888888', fontSize: 10, textAlign: 'center', marginTop: 4, paddingHorizontal: 4 },
  doctorsList: { paddingTop: hp(12), paddingBottom: hp(50), gap: 14 },
  doctorCard: {
    width: 155, backgroundColor: '#F8F8F8', borderRadius: 16, overflow: 'hidden',
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  doctorImage: { width: '100%', height: hp(180), backgroundColor: '#1D9E7533' },
  doctorInfo: { padding: 10 },
  doctorName: {},
  doctorSpec: { fontSize: 11, color: '#888888', marginVertical: 3 },
  kncFloatBtn: {
    position: 'absolute', bottom: hp(110), right: wp(20),
    width: 70, height: 70, borderRadius: 35, backgroundColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center',
    elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.20, shadowRadius: 8, overflow: 'hidden',
  },
  kncImage: { width: 60, height: 60, borderRadius: 30 },
});