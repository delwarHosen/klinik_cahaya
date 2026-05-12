import { PendingIcon } from "@/assets/icons/admin_icon/PendingIcon";
import { SettingIcon } from "@/assets/icons/admin_icon/SettingIcon";
import { ApointmentIcon } from "@/assets/icons/common_icon/AppointmentIcon";
import { HomeIcon } from "@/assets/icons/common_icon/HomeIcon";
import { hp, wp } from "@/utils/responsiveDevice";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabIcon = ({ focused, children }: { focused: boolean; children: React.ReactNode }) => (
    <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: focused ? '#fff' : 'transparent',
        borderRadius: 22,
        width: 44,
        height: 44,
        elevation: focused ? 0 : 0,
    }}>
        {children}
    </View>
);

export default function AdminTabsLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: "#2596BE",
                tabBarInactiveTintColor: "#13193A",
                tabBarStyle: {
                    backgroundColor: "#F8F8F8",
                    height: hp(50) + insets.bottom,
                    position: 'absolute',
                    bottom: 0,
                    left: wp(20),
                    right: wp(20),
                    borderTopWidth: 0,
                    elevation: 0,
                    shadowOpacity: 0,
                    paddingBottom: insets.bottom,
                    paddingTop: 8,
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon focused={focused}>
                            <HomeIcon color={color} size={24} />
                        </TabIcon>
                    ),
                }}
            />
            <Tabs.Screen
                name="details"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon focused={focused}>
                            <PendingIcon color={color} size={24} />
                        </TabIcon>
                    ),
                }}
            />
            <Tabs.Screen
                name="apointment"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon focused={focused}>
                            <ApointmentIcon color={color} size={24} />
                        </TabIcon>
                    ),
                }}
            />
            <Tabs.Screen
                name="setting"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon focused={focused}>
                            <SettingIcon color={color} size={24} />
                        </TabIcon>
                    ),
                }}
            />
        </Tabs>
    );
}