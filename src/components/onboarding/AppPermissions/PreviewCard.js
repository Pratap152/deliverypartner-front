import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PreviewCard = ({
    icon,
    iconColor = '#1F3365',
    iconBackground = '#F3F0FF',
    title,
    subtitle,
    status,
    onEdit,
    children,
}) => {
    const getStatusStyle = () => {
        if (!status) return styles.completedBadge;

        const value = status.toLowerCase();

        if (
            value === 'approved' ||
            value === 'verified' ||
            value === 'completed'
        ) {
            return styles.completedBadge;
        }

        if (value === 'pending') {
            return styles.pendingBadge;
        }

        if (value === 'rejected') {
            return styles.rejectedBadge;
        }

        return styles.completedBadge;
    };

    const getStatusTextStyle = () => {
        if (!status) return styles.completedText;

        const value = status.toLowerCase();

        if (
            value === 'approved' ||
            value === 'verified' ||
            value === 'completed'
        ) {
            return styles.completedText;
        }

        if (value === 'pending') {
            return styles.pendingText;
        }

        if (value === 'rejected') {
            return styles.rejectedText;
        }

        return styles.completedText;
    };

    return (
        <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.leftContainer}>
                    <View
                        style={[
                            styles.iconContainer,
                            { backgroundColor: iconBackground },
                        ]}
                    >
                        <Ionicons
                            name={icon}
                            size={28}
                            color={iconColor}
                        />
                    </View>

                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{title}</Text>

                        {subtitle ? (
                            <Text style={styles.subtitle}>{subtitle}</Text>
                        ) : null}
                    </View>
                </View>

                {onEdit && (
                    <TouchableOpacity
                        style={styles.editButton}
                        activeOpacity={0.8}
                        onPress={onEdit}
                    >
                        <Ionicons
                            name="create-outline"
                            size={16}
                            color="#1F3365"
                        />
                        <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Body */}
            <View style={styles.body}>
                {children}
            </View>

            {/* Status */}
            {status && (
                <View style={styles.statusContainer}>
                    <View style={getStatusStyle()}>
                        <Ionicons
                            name={
                                status.toLowerCase() === 'rejected'
                                    ? 'close-circle'
                                    : status.toLowerCase() === 'pending'
                                        ? 'time-outline'
                                        : 'checkmark-circle'
                            }
                            size={15}
                            color={getStatusTextStyle().color}
                        />

                        <Text
                            style={[
                                styles.statusText,
                                getStatusTextStyle(),
                            ]}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
};

export default PreviewCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 18,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    statusContainer: {
        marginTop: 10,
        alignItems: 'flex-end',
    },

    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    editText: {
        marginLeft: 4,
        fontSize: 15,
        fontWeight: '700',
        color: '#1F3365',
    },

    leftContainer: {
        flexDirection: 'row',
        flex: 1,
        paddingRight: 12,
    },

    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },

    titleContainer: {
        flex: 1,
        justifyContent: 'center',
        minHeight: 56,
    },

    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },

    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },


    body: {
        marginTop: 16,
    },

    completedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F8EE',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 16,
    },

    pendingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF7E6',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 16,
    },
    rejectedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FDECEC',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 16,
    },

    statusText: {
        marginLeft: 4,
        fontSize: 12,
        fontWeight: '600',
    },

    completedText: {
        color: '#22A55A',
    },

    pendingText: {
        color: '#F59E0B',
    },

    rejectedText: {
        color: '#DC2626',
    },
});