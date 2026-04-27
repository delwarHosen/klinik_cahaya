import { Body2, H6 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

interface Props {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    type?: 'Cancel' | 'Delete';
}

export function CancelModal({ visible, onClose, onConfirm, type = 'Cancel' }: Props) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalCard}>
                    {/* Warning Icon */}
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="alert-decagram-outline" size={50} color={Colors.MODAL_BUTTON} />
                    </View>

                    <H6 weight="bold" align="center" style={{ marginTop: hp(20) }}>Are You Sure</H6>
                    <H6 align="center">
                        Do You Want To <H6 color="red">{type}</H6> This {type === 'Cancel' ? 'Request' : 'Appointment'}
                    </H6>

                    <View style={styles.btnRow}>
                        <TouchableOpacity style={styles.backBtn} onPress={onClose}>
                            <Body2 weight="bold">Back</Body2>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
                            <Body2 weight="bold" color={Colors.COLOR_DANGER}>{type}</Body2>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalCard: { width: wp(330), backgroundColor: '#FFF', borderRadius: 24, padding: wp(25), alignItems: 'center' },
    iconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFF0F0', justifyContent: 'center', alignItems: 'center' },
    btnRow: { flexDirection: 'row', gap: wp(15), marginTop: hp(30) },
    backBtn: { flex: 1, height: hp(50), borderRadius: 12, borderWidth: 1, borderColor: '#EEE', justifyContent: 'center', alignItems: 'center' },
    confirmBtn: { flex: 1, height: hp(50), borderRadius: 12, borderWidth: 1, borderColor: '#FFE0E0', justifyContent: 'center', alignItems: 'center' },
});