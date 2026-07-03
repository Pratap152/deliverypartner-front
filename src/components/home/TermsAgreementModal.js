import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getLegalDocuments } from '../../services/termsDocumentsService';

const CheckBox = ({ checked, onPress }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[
                styles.checkbox,
                checked && styles.checkboxChecked,
            ]}>
            {checked && <Text style={styles.tick}>✓</Text>}
        </TouchableOpacity>
    );
};

const CheckItem = ({
    checked,
    text,
    onPress,
}) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={styles.checkItem}
            onPress={onPress}>
            <CheckBox
                checked={checked}
                onPress={onPress}
            />

            <Text style={styles.checkText}>
                {text}
            </Text>
        </TouchableOpacity>
    );
};

const TermsAgreementModal = ({
    visible,
    loading = false,
    onAccept,
}) => {
    const navigation = useNavigation();

    const TERMS_PDF = 'https://www.africau.edu/images/default/sample.pdf';

    const termsText = [
        "You agree to comply with all applicable Platform policies and operational guidelines.",
        "You consent to the electronic execution of these documents under the Information Technology Act, 2000.",
        "You understand that your engagement is subject to successful verification and ongoing compliance.",
        "You authorise ZestBot to maintain electronic records of your acceptance, including the date and time of acceptance, the version of the documents accepted, and technical identifiers reasonably necessary to evidence acceptance."
    ];

    const [checks, setChecks] = useState({
        agreement: false,
        policy: false,
        privacy: false,
        information: false,
        electronic: false,
    });

    const confirmationText = [{ text: "I have read and agree to the Delivery Partner Agreement.", checked: checks.agreement, key: 'agreement' },
    { text: "I have read and agree to the Rider Onboarding & Operations Policy.", checked: checks.policy, key: 'policy' },
    { text: "I have read and agree to the Privacy Policy.", checked: checks.privacy, key: 'privacy' },
    { text: "I confirm that all information and documents submitted are true and accurate.", checked: checks.information, key: 'information' },
    { text: "I consent to electronic communications and electronic records.", checked: checks.electronic, key: 'electronic' }
    ];

    const toggle = key => {
        setChecks(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const allChecked =
        checks.agreement &&
        checks.policy &&
        checks.privacy &&
        checks.information &&
        checks.electronic;

    const openDocument = async (documentKey) => {
        try {

            const response = await getLegalDocuments();
            // console.log('Legal documents response:', response);

            const allPolicies = response.data.find(
                item =>
                    item.type === 'ALL_POLICIES' &&
                    item.isActive === true,
            );

            if (allPolicies) {
                navigation.navigate('PdfViewerScreen', {
                    title: allPolicies.title,
                    pdfUrl: allPolicies.contentUrl,
                });
                return;
            }

            // Separate PDFs
            const url = response.data.find(doc => doc.type === documentKey && doc.isActive === true)?.contentUrl;
            if (url) {
                console.log('Navigating to PdfViewer with URL:', url);
                navigation.navigate('PdfViewerScreen', {
                    title: response.data.find(doc => doc.type === documentKey)?.title,
                    pdfUrl: url,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            statusBarTranslucent
            onRequestClose={() => { }}>
            <View style={styles.overlay}>
                <View style={styles.container}>

                    <Text style={styles.title}>
                        Terms of Engagement
                    </Text>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: 20,
                        }}
                    >
                        <Text style={styles.description}>
                            By selecting{' '}
                            <Text style={{ fontWeight: '700' }}>
                                "I Agree & Continue"
                            </Text>
                            , you confirm that:
                        </Text>

                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 5, }}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.bullet}>
                                You have read and understood the{' '}

                                <Text
                                    style={styles.link}
                                    onPress={() => openDocument('DELIVERY_PARTNER_AGREEMENT')}>
                                    Delivery Partner Agreement
                                </Text>
                                {', '}
                                <Text
                                    style={styles.link}
                                    onPress={() => openDocument('OPERATIONS_POLICY')}>
                                    Rider Onboarding & Operations Policy
                                </Text>
                                {', '}
                                <Text
                                    style={styles.link}
                                    onPress={() => openDocument('PRIVACY_POLICY')}>
                                    Privacy Policy
                                </Text>
                                {' and '}
                                <Text
                                    style={styles.link}
                                    onPress={() => openDocument('ELECTRONIC_CONSENT')}>
                                    Code of Conduct
                                </Text>
                                .
                            </Text>
                        </View>

                        {termsText.map((text, index) => (
                            <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 5, }}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bullet}>{text}</Text>
                            </View>
                        ))}

                        <Text style={styles.heading}>
                            Confirmation
                        </Text>

                        {confirmationText.map((item) => (
                            <CheckItem
                                key={item.key}
                                checked={item.checked}
                                text={item.text}
                                onPress={() => toggle(item.key)}
                            />
                        ))}
                    </ScrollView>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={!allChecked || loading}
                        onPress={() => onAccept(checks)}
                        style={[
                            styles.button,
                            (!allChecked || loading) && styles.buttonDisabled,
                        ]}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.buttonText}>
                                I Agree & Continue
                            </Text>
                        )}
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
};

export default TermsAgreementModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        padding: 20,
    },

    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 20,
        maxHeight: '90%',
    },

    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#222',
        marginBottom: 15,
        textAlign: 'center',
    },

    description: {
        fontSize: 15,
        color: '#444',
        lineHeight: 22,
        marginBottom: 15,
    },
    link: {
        color: '#0A84FF',
        textDecorationLine: 'underline',
        fontWeight: '400',
    },
    bullet: {
        fontSize: 14,
        color: '#555',
        lineHeight: 22,
        marginBottom: 10,
    },

    heading: {
        fontSize: 17,
        fontWeight: '700',
        color: '#222',
        marginTop: 20,
        marginBottom: 15,
    },

    checkItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 18,
    },

    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#999',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
    },

    checkboxChecked: {
        backgroundColor: '#0A84FF',
        borderColor: '#0A84FF',
    },

    tick: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },

    checkText: {
        flex: 1,
        marginLeft: 12,
        color: '#444',
        fontSize: 14,
        lineHeight: 21,
    },

    button: {
        backgroundColor: '#0A84FF',
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 10,
    },

    buttonDisabled: {
        backgroundColor: '#BDBDBD',
    },

    buttonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16,
    },
});