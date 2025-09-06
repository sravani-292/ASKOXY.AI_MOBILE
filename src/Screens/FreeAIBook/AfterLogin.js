import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Dimensions, TextInput, Alert } from 'react-native'
import React, { useState, useRef } from 'react'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const AfterLogin = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [pageInputVisible, setPageInputVisible] = useState(false);
    const [pageInput, setPageInput] = useState('');
    const flatListRef = useRef(null);

    const images = [
        "https://i.ibb.co/20wfNSqw/Book-0.jpg",
        "https://i.ibb.co/Z6WNjTDG/Book-1.jpg",
        "https://i.ibb.co/cKgqZ0fQ/Book-2.jpg",
        "https://i.ibb.co/7djCjVfR/Book-3.jpg",
        "https://i.ibb.co/VYGRb764/Book-4.jpg",
        "https://i.ibb.co/N2Rqt1VK/Book-5.jpg",
        "https://i.ibb.co/B2frc28Q/Book-6.jpg",
        "https://i.ibb.co/HptP8Dg5/Book-7.jpg",
        "https://i.ibb.co/PzZhYkHD/9.jpg",
        "https://i.ibb.co/YBN9HrhV/Book-9.jpg",
        "https://i.ibb.co/BVdcRqwh/Book-10.jpg",
        "https://i.ibb.co/ymFZpPFm/Book-11.jpg",
        "https://i.ibb.co/Gb6g50q/Book-12.jpg",
        "https://i.ibb.co/r2B6ckkh/Book-13.jpg",
        "https://i.ibb.co/1Y4DJFZ2/Book-14.jpg",
        "https://i.ibb.co/DPH8hLXs/Book-15.jpg",
        "https://i.ibb.co/JFshNMz1/Book-16.jpg",
        "https://i.ibb.co/KpxpNgyD/Book-17.jpg",
        "https://i.ibb.co/99Mj47p0/Book-18.jpg",
        "https://i.ibb.co/LzFVMGd8/Book-19.jpg",
        "https://i.ibb.co/kkWNdrq/Book-20.jpg",
        "https://i.ibb.co/4Rns7CS1/Book-21.jpg",
        "https://i.ibb.co/V0xFQNpX/Book-22.jpg",
        "https://i.ibb.co/svCPwX8H/Book-23.jpg",
        "https://i.ibb.co/Vc2LN0JX/Book-24.jpg",
        "https://i.ibb.co/mC6ch2Lb/Book-25.jpg",
        "https://i.ibb.co/YFLMbdB0/Book-26.jpg",
        "https://i.ibb.co/C567G3zZ/Book-27.jpg",
        "https://i.ibb.co/pBkwKNGJ/Book-28.jpg",
        "https://i.ibb.co/QFv2Vhxw/Book-29.jpg",
        "https://i.ibb.co/JjkTpph1/Book-30.jpg",
        "https://i.ibb.co/bMv8wt1W/Book-31.jpg",
        "https://i.ibb.co/dwTqHz9T/Book-32.jpg",
        "https://i.ibb.co/TMgFSG2j/Book-33.jpg",
        "https://i.ibb.co/n8wRm52j/Book-34.jpg",
        "https://i.ibb.co/P0HVQDM/Book-35.jpg",
        "https://i.ibb.co/20T9NC8L/Book-36.jpg",
        "https://i.ibb.co/WWq8tKd9/Book-37.jpg",
        "https://i.ibb.co/fGNgZ77n/Book-38.jpg",
        "https://i.ibb.co/qHkfm13/Book-39.jpg",
        "https://i.ibb.co/Gv1JsG1C/Book-40.jpg",
        "https://i.ibb.co/XkbWgGjC/Book-41.jpg",
        "https://i.ibb.co/bMfbqZTT/Book-42.jpg",
        "https://i.ibb.co/MxJScM8g/Book-43.jpg",
        "https://i.ibb.co/wr8drSjZ/Book-44.jpg",
        "https://i.ibb.co/NgrfRNbx/Book-45.jpg",
        "https://i.ibb.co/MDR47LLL/Book-46.jpg",
        "https://i.ibb.co/39Bbv8jy/Book-47.jpg",
        "https://i.ibb.co/bgcTzm8z/Book-48.jpg",
        "https://i.ibb.co/b5wN7gMm/Book-49.jpg",
        "https://i.ibb.co/Fb5wSMBX/Book-50.jpg",
        "https://i.ibb.co/ccp56PjT/Book-51.jpg",
        "https://i.ibb.co/HRYMg86/Book-52.jpg",
        "https://i.ibb.co/h1Bv1Fmf/Book-53.jpg",
        "https://i.ibb.co/fdt9dRgG/Book-54.jpg",
        "https://i.ibb.co/n8KLt2Z9/Book-55.jpg",
        "https://i.ibb.co/RGbqTxx4/Book-56.jpg",
        "https://i.ibb.co/5gv4r3Sd/Book-57.jpg",
        "https://i.ibb.co/RkYgFmj0/Book-58.jpg",
        "https://i.ibb.co/274pNcwx/Book-59.jpg",
        "https://i.ibb.co/4RqRrxx7/Book-60.jpg",
        "https://i.ibb.co/kgyNCKTt/Book-61.jpg",
        "https://i.ibb.co/fzFr7w7L/Book-62.jpg",
        "https://i.ibb.co/mrzn9SLy/Book-63.jpg",
        "https://i.ibb.co/84RVLNXg/Book-64.jpg",
        "https://i.ibb.co/wZtw6ZPP/Book-65.jpg",
        "https://i.ibb.co/JW7fCFbY/Book-66.jpg",
        "https://i.ibb.co/SDpnFrKw/Book-67.jpg",
        "https://i.ibb.co/2Ygxpjcc/Book-68.jpg",
        "https://i.ibb.co/v4tj75Pg/Book-69.jpg",
        "https://i.ibb.co/BHd4RDpN/Book-70.jpg",
        "https://i.ibb.co/842mMxhV/Book-71.jpg",
        "https://i.ibb.co/G4xDwRqY/Book-72.jpg",
    ];

    const totalPages = images.length;

    // Handle scroll to update current page
    const onScroll = (event) => {
        const contentOffset = event.nativeEvent.contentOffset;
        const viewSize = event.nativeEvent.layoutMeasurement;
        const pageNum = Math.round(contentOffset.x / viewSize.width);
        setCurrentPage(pageNum);
    };

    // Navigate to specific page
    const goToPage = (pageNumber) => {
        if (pageNumber >= 0 && pageNumber < totalPages) {
            flatListRef.current?.scrollToIndex({
                index: pageNumber,
                animated: true
            });
            setCurrentPage(pageNumber);
        }
    };

    // Handle page input submission
    const handlePageInputSubmit = () => {
        const pageNumber = parseInt(pageInput) - 1; 
        if (isNaN(pageNumber) || pageNumber < 0 || pageNumber >= totalPages) {
            Alert.alert('Invalid Page', `Please enter a page number between 1 and ${totalPages}`);
            return;
        }
        goToPage(pageNumber);
        setPageInput('');
        setPageInputVisible(false);
    };

    const goToPrevious = () => {
        if (currentPage > 0) {
            goToPage(currentPage - 1);
        }
    };

    const goToNext = () => {
        if (currentPage < totalPages - 1) {
            goToPage(currentPage + 1);
        }
    };

    const renderBookPage = ({ item, index }) => (
        <View style={styles.pageContainer}>
            <Image
                source={{ uri: item }}
                style={styles.pageImage}
                resizeMode="contain"
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>AI Universe Book</Text>
                <TouchableOpacity
                    onPress={() => setPageInputVisible(!pageInputVisible)}
                    style={styles.pageNumberButton}
                >
                    <Text style={styles.pageNumberText}>
                        {currentPage + 1} / {totalPages}
                    </Text>
                </TouchableOpacity>
            </View>

            {pageInputVisible && (
                <View style={styles.pageInputContainer}>
                    <TextInput
                        style={styles.pageInput}
                        placeholder={`Enter page (1-${totalPages})`}
                        value={pageInput}
                        onChangeText={setPageInput}
                        keyboardType="numeric"
                        maxLength={3}
                    />
                    <TouchableOpacity
                        onPress={handlePageInputSubmit}
                        style={styles.goButton}
                    >
                        <Text style={styles.goButtonText}>Go</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setPageInputVisible(false);
                            setPageInput('');
                        }}
                        style={styles.cancelButton}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                ref={flatListRef}
                data={images}
                renderItem={renderBookPage}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                getItemLayout={(data, index) => ({
                    length: screenWidth,
                    offset: screenWidth * index,
                    index,
                })}
            />

            <View style={styles.navigationContainer}>
                <TouchableOpacity
                    onPress={goToPrevious}
                    style={[styles.navButton, currentPage === 0 && styles.navButtonDisabled]}
                    disabled={currentPage === 0}
                >
                    <Text style={[styles.navButtonText, currentPage === 0 && styles.navButtonTextDisabled]}>
                        ← Previous
                    </Text>
                </TouchableOpacity>

                <View style={styles.pageIndicator}>
                    <Text style={styles.pageIndicatorText}>
                        Page {currentPage + 1} of {totalPages}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={goToNext}
                    style={[styles.navButton, currentPage === totalPages - 1 && styles.navButtonDisabled]}
                    disabled={currentPage === totalPages - 1}
                >
                    <Text style={[styles.navButtonText, currentPage === totalPages - 1 && styles.navButtonTextDisabled]}>
                        Next →
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.quickNavContainer}>
                <TouchableOpacity
                    onPress={() => goToPage(0)}
                    style={styles.quickNavButton}
                >
                    <Text style={styles.quickNavButtonText}>First Page</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    onPress={() => goToPage(totalPages - 1)}
                    style={styles.quickNavButton}
                >
                    <Text style={styles.quickNavButtonText}>Last Page</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AfterLogin;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    pageNumberButton: {
        backgroundColor: '#007bff',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    pageNumberText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    pageInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    pageInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 16,
        marginRight: 10,
    },
    goButton: {
        backgroundColor: '#28a745',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginRight: 10,
    },
    goButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: '#6c757d',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 8,
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    pageContainer: {
        width: screenWidth,
        height: screenHeight * 0.6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginVertical: 10,
    },
    pageImage: {
        width: screenWidth * 0.9,
        height: '100%',
        borderRadius: 10,
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    navButton: {
        backgroundColor: '#007bff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        minWidth: 100,
    },
    navButtonDisabled: {
        backgroundColor: '#e9ecef',
    },
    navButtonText: {
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center',
    },
    navButtonTextDisabled: {
        color: '#6c757d',
    },
    pageIndicator: {
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    pageIndicatorText: {
        fontSize: 14,
        color: '#495057',
        fontWeight: '500',
    },
    quickNavContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    quickNavButton: {
        backgroundColor: '#6c757d',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    quickNavButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
});