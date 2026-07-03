import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pdf from 'react-native-pdf';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PdfViewerScreen = ({ navigation, route }) => {
    const { title, pdfUrl } = route.params;

    return (
        <SafeAreaView style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <Icon
                        name="arrow-back"
                        size={26}
                        color="#000"
                    />
                </TouchableOpacity>

                <Text
                    numberOfLines={1}
                    style={styles.title}
                >
                    {title || 'Document'}
                </Text>
            </View>

            {/* PDF */}
            <Pdf
                source={{
                    uri: pdfUrl,
                    cache: false,
                }}
                style={styles.pdf}
                trustAllCerts={false}
                onLoadComplete={(pages) => {
                    console.log('Pages:', pages);
                }}
                onPageChanged={(page, pages) => {
                    console.log(`Page ${page}/${pages}`);
                }}
                onError={(error) => {
                    console.log('PDF Error:', error);
                }}
            />

        </SafeAreaView>
    );
};

export default PdfViewerScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },

    header: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        paddingHorizontal: 10,
        backgroundColor: '#FFF',
        elevation: 2,
    },

    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },

    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
        color: '#222',
    },

    pdf: {
        flex: 1,
    },
});