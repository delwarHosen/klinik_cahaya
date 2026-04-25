import { NotificationIcon } from '@/assets/icons/common_icon/Notification';
import { RightArrowIcon } from '@/assets/icons/common_icon/RightArrowIcon';
import { AntenatalIcon } from '@/assets/icons/patient_icon/AntenatalIcon';
import { GeneralIcon } from '@/assets/icons/patient_icon/GenaralIcon';
import { PediatricIcon } from '@/assets/icons/patient_icon/PediatricIcon';
import { VaccinesIcon } from '@/assets/icons/patient_icon/VaccinesIcon';
import { ButtonText, H3, H5, H6 } from '@/components/typo/Typography';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import React, { useRef } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Fake Data ───────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  { id: '1', title: 'Book Appointment' },
  { id: '2', title: 'Queue Status' },
  { id: '3', title: 'Vaccine Stock' },
  { id: '4', title: 'Medical Record' },
];

const SERVICES = [
  {
    id: '1', name: 'General', icon: <>
      <GeneralIcon />
    </>, type: 'feather'
  },
  { id: '2', name: 'Pediatric', icon: <PediatricIcon />, type: 'svg' },
  { id: '3', name: 'Antenatal', icon: <AntenatalIcon />, type: 'material' },
  { id: '4', name: 'Vaccination', icon: <VaccinesIcon />, type: 'material' },
  { id: '5', name: 'Dental', icon: <GeneralIcon />, type: 'material' },
  { id: '6', name: 'Eye Care', icon: <AntenatalIcon />, type: 'material' },
];

const DOCTORS = [
  { id: '1', name: 'Dr. Anis', specialty: 'General Practice', tier: 'Tier 1', image: 'https://i.pravatar.cc/150?u=anis' },
  { id: '2', name: 'Dr. Noor Liyana', specialty: 'General Practice', tier: 'Tier 2', image: 'https://i.pravatar.cc/150?u=noor' },
  { id: '3', name: 'Dr. Zaid', specialty: 'Pediatrician', tier: 'Tier 1', image: 'https://i.pravatar.cc/150?u=zaid' },
  { id: '4', name: 'Dr. Sara', specialty: 'Antenatal Care', tier: 'Tier 1', image: 'https://i.pravatar.cc/150?u=sara' },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const servicesScrollRef = useRef<ScrollView>(null);
  const doctorsListRef = useRef<FlatList>(null);

  const handleServicesArrow = () => {
    servicesScrollRef.current?.scrollTo({ x: 200, animated: true });
  };

  const handleDoctorsArrow = () => {
    doctorsListRef.current?.scrollToOffset({ offset: 200, animated: true });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* ── Scrollable body ── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image source={IMAGE_COMPONENTS.logo} style={styles.logo} />
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconBtn}>
              <NotificationIcon />
            </TouchableOpacity>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?u=user' }}
              style={styles.avatar}
            />
          </View>
        </View>

        {/* ── Search Bar ── */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search doctors or service"
              placeholderTextColor="#999"
              style={styles.searchInput}
            />
            <TouchableOpacity style={styles.searchBtn}>
              <ButtonText style={styles.searchBtnText}>Search</ButtonText>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Quick Actions Grid ── */}
        <View style={styles.gridContainer}>
          {QUICK_ACTIONS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.gridItem} activeOpacity={0.75}>
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
          {SERVICES.map((item) => (
            <TouchableOpacity key={item.id} style={styles.serviceCard} activeOpacity={0.8}>
              <View style={styles.serviceIconContainer}>
                <View style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }}>
                  {item.icon}
                </View>

                <H6 style={styles.serviceName}>{item.name}</H6>
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
            <TouchableOpacity style={styles.doctorCard} activeOpacity={0.85}>
              <Image source={{ uri: item.image }} style={styles.doctorImage} />
              <View style={styles.doctorInfo}>
                <H5 style={styles.doctorName}>{item.name}</H5>
                <Text style={styles.doctorSpec}>{item.specialty}</Text>
                <View
                  style={[
                    styles.tierBadge,
                    { backgroundColor: item.tier === 'Tier 1' ? '#E8F5E9' : '#FFF3E0' },
                  ]}
                >
                  <Text
                    style={[
                      styles.tierText,
                      { color: item.tier === 'Tier 1' ? '#388E3C' : '#F57C00' },
                    ]}
                  >
                    {item.tier}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

      </ScrollView>

      {/* ── KNC Fixed Floating Button (always bottom-right) ── */}
      <TouchableOpacity style={styles.kncFloatBtn} activeOpacity={0.85}>
        <Image
          source={IMAGE_COMPONENTS.contactLogo}
          style={styles.kncImage}
          resizeMode="cover"
        />
      </TouchableOpacity>

    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

  // ── Layout
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: wp(20),
    paddingTop: hp(10),
    paddingBottom: hp(100),   // room above bottom nav
  },

  // ── Header
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

  // ── Search
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
  searchBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },

  // ── Quick Actions Grid
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

  // ── Section Header
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

  // ── Services
  servicesList: {
    paddingTop: hp(14),
    paddingBottom: hp(4),
    gap: 14,
  },
  serviceCard: {
    // width: 84,
    alignItems: 'center',
    gap: 8,
  },
  serviceIconContainer: {
    width: wp(110),
    height: hp(140),
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  serviceName: {
    // fontSize: 12,
    color: Colors.BRAND_PRIMARY,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: hp(20)
  },

  // ── Doctors
  doctorsList: {
    paddingTop: hp(12),
    paddingBottom: hp(10),
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
  doctorName: {
    fontWeight: '700',
    // fontSize: 13,
    color: '#e40f0f',
  },
  doctorSpec: {
    fontSize: 11,
    color: '#888888',
    marginVertical: 3,
  },
  tierBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  tierText: {
    fontSize: 10,
    fontWeight: '700',
  },

  // ── KNC Floating Button
  kncFloatBtn: {
    position: 'absolute',
    bottom: hp(30),
    right: wp(20),
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
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