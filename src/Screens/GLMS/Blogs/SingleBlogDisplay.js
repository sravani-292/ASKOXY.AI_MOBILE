import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Share,
  Dimensions,
  Linking,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useCallback } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import BASE_URL from "../../../../Config";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("window");

const SingleBlogDisplay = ({ route }) => {
  const { blogData } = route.params;
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [dislike, setDisLike] = useState(false);
  const [commentCount, setCommentCount] = useState(15);
  const [shareCount, setShareCount] = useState(8);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [displayComments, setDisplayComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [mobile, setMobile] = useState("");
  const [mobile_error, setMobile_error] = useState(false);
  const [email, setEmail] = useState("");
  const [email_error, setemail_error] = useState(false);
  const [query, setQuery] = useState("");
  const [query_error, setquery_error] = useState(false);
  const [submitQueryLoading, setSubmitQueryLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const userData = useSelector((state) => state.counter);
  const token = userData?.accessToken;
  const customerId = userData?.userId;
  useFocusEffect(
    useCallback(() => {
      viewComments();
      subscribefetchfunc();
    }, [])
  );

  const subscribefetchfunc = () => {
    axios({
      method: "get",
      url: `${BASE_URL}marketing-service/campgin/getcampainlikesandcommentsbycamapignid?campaignId=${route?.params?.blogData.campaignId}&userId=${customerId}`,
      
    })
      .then((response) => {
        // console.log("subscribefetchfunc response", response.data);
        const data = response.data;

        // Update like status and count
        setLikeCount(data.likesTotalCount || 0);
        if (data.likeStatus === "yes") {
          setLiked(true);
          setDisLike(false);
        } else if (data.likeStatus === "no") {
          setLiked(false);
          setDisLike(true);
        } else {
          setLiked(false);
          setDisLike(false);
        }

        // Update subscription status
        setIsSubscribed(data.subscribed === "yes");
      })
      .catch((error) => {
        console.log("error", error.response);
      });
  };
  const handleUserInteraction = (type, value = null) => {
    console.log({ type }, { value });
    console.log({ liked }, { dislike });
    let data = {
      campaignId: route?.params?.blogData.campaignId,
      userId: customerId,
      interavtionType: type,
      likeStatus: value,
      subscribed: null,
      userComments: null,
    };

    if (type === "SUBSCRIBE")
      data.subscribed = isSubscribed ? "no" : "yes"; // Toggle subscription
    else if (type === "COMMENTS") {
      if (!value?.trim()) {
        Alert.alert("Error", "Please enter a comment");
        return;
      }
      data.userComments = value.trim();
    } else if (type === "LIKEORDISLIKE") data.likeStatus = value;

    setLoading(true);
    axios({
      method: "post",
      url: `${BASE_URL}marketing-service/campgin/filluserinteractions`,
      data,
    })
      .then((response) => {
        console.log("response", response.data);
        if (type === "COMMENTS") {
          setCommentText("");
          setShowCommentModal(false);
          viewComments();
          Alert.alert("Success", "Comment added successfully!");
        }
        if (type === "LIKEORDISLIKE") {
          // Refresh the data to get updated counts
          subscribefetchfunc();
        }
        if (value === "yes") {
          setLiked(true);
          setDisLike(false);
        }
        if (value === "no") {
          setLiked(false);
          setDisLike(true);
        }
        if (type === "SUBSCRIBE") {
          Alert.alert(
            "Success",
            isSubscribed
              ? "Unsubscribed successfully!"
              : "Subscribed successfully!"
          );
          // Refresh the data
          subscribefetchfunc();
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log("error", error.response);
        Alert.alert("Error", "Failed to process interaction");
        setLoading(false);
      });
  };

  function viewComments() {
    setCommentLoading(true);
    axios({
      method: "get",
      url: `${BASE_URL}marketing-service/campgin/getcampainlikesandcommentsbycamapignid?campaignId=${route?.params?.blogData.campaignId}&userId=${customerId}`,
    })
      .then((response) => {
        // console.log("Comments response:", response.data);
        setDisplayComments(response.data.subComments || []);
        setCommentCount(response.data.subComments?.length || 0);
        setCommentLoading(false);
      })
      .catch((error) => {
        console.log("error", error.response);
        setDisplayComments([]);
        setCommentLoading(false);
      });
  }

  const handleComment = () => {
    setShowCommentModal(true);
    setReplyingTo(null);
    setReplyText("");
  };
  const handleShare = async () => {
    try {
      const plainDescription = getCleanDescription(
        blogData.campaignDescription
      ); // 👈 plain text

      await Share.share({
        message: `Check out this amazing blog: ${blogData.campaignType}\n\n${plainDescription}\n\n${blogData.socialMediaCaption}`,
        title: blogData.campaignType,
      });

      setShareCount(shareCount + 1);
    } catch (error) {
      Alert.alert("Error", "Could not share the blog");
    }
  };

  const submitComment = () => {
    if (commentText.trim()) {
      var data = {
        campaignId: route?.params?.blogData.campaignId,
        userId: customerId,
        interavtionType: "COMMENTS",
        likeStatus: null,
        subscribed: null,
        userComments: commentText.trim(),
      };
      setLoading(true);
      axios({
        url: `${BASE_URL}marketing-service/campgin/filluserinteractions`,
        method: "post",
        data,
      })
        .then((response) => {
          console.log("Comment submitted:", response.data);
          setCommentText("");
          setShowCommentModal(false);
          viewComments();
          Alert.alert("Success", "Comment added successfully!");
          setLoading(false);
        })
        .catch((error) => {
          console.log("error", error.response);
          Alert.alert("Error", "Failed to add comment");
          setLoading(false);
        });
    } else Alert.alert("Error", "Please enter a comment");
  };

  const handleReply = (comment) => {
    setReplyingTo(comment);
    setCommentText("");
  };
  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  const submitReply = () => {
    console.log({ replyingTo });
    if (replyText.trim() && replyingTo) {
      var data = {
        mainCommentId: replyingTo.mainCommentId,
        userId: customerId,
        subComment: replyText,
      };
      console.log({ data });
      setLoading(true);
      axios({
        url: `${BASE_URL}marketing-service/campgin/fillusersubinteractioncomments`,
        method: "post",
        data,
      })
        .then((response) => {
          console.log("Reply submitted:", response.data);
          setReplyText("");
          setReplyingTo(null);
          viewComments();
          Alert.alert("Success", "Reply added successfully!");
          setLoading(false);
        })
        .catch((error) => {
          console.log("error", error.response);
          Alert.alert("Error", "Failed to add reply");
          setLoading(false);
        });
    } else Alert.alert("Error", "Please enter a reply");
  };

  const formatDescription = (text) => {
    return text.split("\n").map((line, index) => {
      if (line.trim() === "") return null;
      if (
        line.includes("☕") ||
        line.includes("🥙") ||
        line.includes("🍹") ||
        line.includes("🍲")
      )
        return (
          <Text key={index} style={styles.sectionHeader}>
            {line}
          </Text>
        );
      if (line.includes("🔑"))
        return (
          <Text key={index} style={styles.keyPoint}>
            {line}
          </Text>
        );
      if (line.includes("📈"))
        return (
          <Text key={index} style={styles.result}>
            {line}
          </Text>
        );
      if (line.includes("🤖"))
        return (
          <Text key={index} style={styles.aiIdea}>
            {line}
          </Text>
        );
      if (line.includes("✨"))
        return (
          <Text key={index} style={styles.takeaway}>
            {line}
          </Text>
        );
      return (
        <Text key={index} style={styles.paragraph}>
          {line}
        </Text>
      );
    });
  };

  const getCleanDescription = (text) => {
    if (!text) return "";
    let cleanText = text;
    cleanText = cleanText.replace(/###.*[\s\S]*/gi, "");
    return cleanText.trim();
  };

  const submitQuery = () => {
    console.log(mobile, email, query);
    if (mobile == "") {
      setMobile_error(true);
      return false;
    }
    if (email == "") {
      setemail_error(true);
      return false;
    }
    if (query == "") {
      setquery_error(true);
      return false;
    }
    var data = {
      email: email,
      mobileNumber: mobile,
      queryStatus: "PENDING",
      projectType: "ASKOXY",
      askOxyOfers: "FREEAI",
      adminDocumentId: "",
      comments: "",
      id: "",
      resolvedBy: "",
      resolvedOn: "",
      status: "",
      userDocumentId: "",
      query: query,
      userId: customerId,
    };
    console.log({ data });
    setSubmitQueryLoading(true);
    axios({
      method: "post",
      url: `${BASE_URL}user-service/write/saveData`,
      data,
    })
      .then((response) => {
        console.log("response", response.data);
        setSubmitQueryLoading(false);
        setModalVisible(false);
        Alert.alert("Success", "Successfully submitted your query");
      })
      .catch((error) => {
        console.log("error", error.response.data);
        setSubmitQueryLoading(false);
        Alert.alert("Error", error.response.data.error);
      });
  };

  const renderCommentItem = ({ item }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <Text style={styles.commentUser}>User</Text>
        <TouchableOpacity
          style={styles.replyButton}
          onPress={() => handleReply(item)}
        >
          <Text style={styles.replyButtonText}>Reply</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.commentText}>{item.mainComment}</Text>
      {item.subComments && item.subComments.length > 0 && (
        <View style={styles.repliesContainer}>
          {item.subComments.map((reply, index) => (
            <View key={index} style={styles.replyItem}>
              <Text style={styles.replyText}>Reply : {reply.comment}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{blogData.campaignType}</Text>
          <Text style={styles.author}>
            By{" "}
            {blogData.campaignTypeAddBy ? blogData.campaignTypeAddBy : "Admin"}{" "}
          </Text>
          <Text style={styles.date}>
            {new Date(blogData.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
        </View>

        <View style={styles.content}>
          {formatDescription(getCleanDescription(blogData.campaignDescription))}
        </View>

        <View style={styles.socialSection}>
          <Text style={styles.socialTitle}>Social Media Caption:</Text>
          <Text style={styles.socialCaption}>
            {blogData.socialMediaCaption}
          </Text>
        </View>

        {blogData.campaignPostsUrls &&
          blogData.campaignPostsUrls.filter(
            (post) => post.postUrl && post.postUrl.trim() !== ""
          ).length > 0 && (
            <View style={styles.postsSection}>
              <Text style={styles.postsTitle}>Campaign Posts:</Text>
              {blogData.campaignPostsUrls
                .filter((post) => post.postUrl && post.postUrl.trim() !== "")
                .map((post, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      Linking.openURL(post.postUrl).catch(() =>
                        Alert.alert("Error", "Could not open the link")
                      )
                    }
                    style={styles.postLink}
                  >
                    <Icon name="link" size={18} color="#3498DB" />
                    <Text style={styles.postText}>{post.platform}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          )}

        <View style={styles.actionButtonsContainer1}>
          <TouchableOpacity
            style={[
              styles.actionButton1,
              isSubscribed && {
                backgroundColor: "#FFE5E5",
                borderColor: "#FF4757",
              },
            ]}
            onPress={() => handleUserInteraction("SUBSCRIBE")}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#6C63FF" />
            ) : (
              <Ionicons
                name={isSubscribed ? "notifications" : "notifications-outline"}
                size={20}
                color={isSubscribed ? "#FF4757" : "#6C63FF"}
              />
            )}
            <Text
              style={[
                styles.actionButtonText1,
                isSubscribed && { color: "#FF4757" },
              ]}
            >
              {isSubscribed ? "Unsubscribe" : "Subscribe"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton1}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="chatbubble-outline" size={20} color="#6C63FF" />
            <Text style={styles.actionButtonText1}>Write to us</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            This blog is AI-assisted and based on public data. We aim to inform,
            not infringe. Contact us for edits or collaborations:
            support@askoxy.ai
          </Text>
        </View>
      </ScrollView>

      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            handleUserInteraction("LIKEORDISLIKE", liked ? "no" : "yes");
          }}
          disabled={loading}
        >
          <Icon
            name={liked ? "favorite" : "favorite-border"}
            size={24}
            color={liked ? "#FF4757" : "#666"}
          />
          <Text style={styles.actionText}>{likeCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            handleUserInteraction("LIKEORDISLIKE", dislike ? "yes" : "no");
          }}
          disabled={loading}
        >
          <Icon
            name={dislike ? "thumb-down" : "thumb-down-off-alt"}
            size={24}
            color={dislike ? "#0384df" : "#666"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowCommentModal(true)}
          disabled={loading}
        >
          <Icon name="comment" size={24} color="#666" />
          <Text style={styles.actionText}>{commentCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleShare()}
        >
          <Icon name="share" size={24} color="#666" />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCommentModal}
        onRequestClose={() => setShowCommentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {replyingTo
                  ? `Reply to Comment`
                  : `Comments (${displayComments.length})`}
              </Text>
              <TouchableOpacity onPress={() => setShowCommentModal(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {commentLoading ? (
              <ActivityIndicator
                size="large"
                color="#3498DB"
                style={styles.loader}
              />
            ) : (
              !replyingTo && (
                <FlatList
                  data={displayComments}
                  renderItem={renderCommentItem}
                  keyExtractor={(item) => item.mainCommentId}
                  style={styles.commentsList}
                  contentContainerStyle={styles.commentsListContent}
                  showsVerticalScrollIndicator={false}
                />
              )
            )}

            {replyingTo && (
              <View style={styles.replyingToContainer}>
                <Text style={styles.replyingToText}>
                  Replying to:{" "}
                  <Text style={styles.replyingToComment}>
                    {replyingTo.mainComment}
                  </Text>
                </Text>
                <TouchableOpacity
                  onPress={cancelReply}
                  style={styles.cancelReplyButton}
                >
                  <Text style={styles.cancelReplyText}>Cancel Reply</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder={
                  replyingTo
                    ? "Write your reply here..."
                    : "Write your comment here..."
                }
                value={replyingTo ? replyText : commentText}
                onChangeText={replyingTo ? setReplyText : setCommentText}
                multiline
                maxLength={500}
                textAlignVertical="top"
              />
              <View style={styles.modalActions}>
                {replyingTo ? (
                  <>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={cancelReply}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={() => submitReply(replyingTo)}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text style={styles.submitButtonText}>
                          Submit Reply
                        </Text>
                      )}
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    style={[styles.submitButton, styles.fullWidthButton]}
                    onPress={() => submitComment()}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.submitButtonText}>Add Comment</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalView}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.heading}>Write To Us</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={25} />
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              placeholder="+91XXXXXXXXXX"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              value={mobile}
              onChangeText={(text) => {
                setMobile(text), setMobile_error(false);
              }}
            />
            {mobile_error ? (
              <Text style={{ color: "red", alignSelf: "center" }}>
                Mobile Number is mandatory
              </Text>
            ) : null}
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#888"
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => {
                setEmail(text), setemail_error(false);
              }}
            />
            {email_error ? (
              <Text style={{ color: "red", alignSelf: "center" }}>
                Email is mandatory
              </Text>
            ) : null}
            <Text style={styles.label}>Query</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter your query"
              placeholderTextColor="#888"
              multiline={true}
              numberOfLines={4}
              value={query}
              onChangeText={(text) => {
                setQuery(text), setquery_error(false);
              }}
            />
            {query_error ? (
              <Text style={{ color: "red", alignSelf: "center" }}>
                Query is mandatory
              </Text>
            ) : null}
            {submitQueryLoading == false ? (
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => submitQuery()}
              >
                <Text style={styles.submitButtonText}>Submit Query</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.submitButton}>
                <ActivityIndicator size={"small"} color={"white"} />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SingleBlogDisplay;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollView: { flex: 1, paddingBottom: 80 },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: "#E5E5E5" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2C3E50",
    lineHeight: 28,
    marginBottom: 8,
  },
  author: { fontSize: 14, color: "#3498DB", marginBottom: 4 },
  date: { fontSize: 12, color: "#7F8C8D" },
  content: { padding: 20 },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginVertical: 16,
    lineHeight: 24,
  },
  paragraph: {
    fontSize: 16,
    color: "#34495E",
    lineHeight: 24,
    marginBottom: 12,
    textAlign: "justify",
  },
  keyPoint: {
    fontSize: 16,
    color: "#E67E22",
    fontWeight: "600",
    marginVertical: 8,
    lineHeight: 22,
  },
  result: {
    fontSize: 16,
    color: "#27AE60",
    fontWeight: "600",
    marginVertical: 8,
    lineHeight: 22,
  },
  aiIdea: {
    fontSize: 16,
    color: "#8E44AD",
    fontWeight: "600",
    marginVertical: 8,
    lineHeight: 22,
    fontStyle: "italic",
  },
  takeaway: {
    fontSize: 16,
    color: "#F39C12",
    fontWeight: "bold",
    marginVertical: 12,
    lineHeight: 22,
  },
  socialSection: {
    padding: 20,
    backgroundColor: "#F8F9FA",
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
  },
  postsSection: {
    padding: 20,
    backgroundColor: "#F8F9FA",
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  postsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 10,
  },
  postLink: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  postText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#3498DB",
    textDecorationLine: "underline",
  },
  socialCaption: { fontSize: 14, color: "#34495E", lineHeight: 20 },
  disclaimer: {
    padding: 20,
    backgroundColor: "#ECF0F1",
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 150,
  },
  disclaimerText: {
    fontSize: 12,
    color: "#7F8C8D",
    textAlign: "center",
    lineHeight: 16,
    fontStyle: "italic",
  },
  actionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
  },
  actionButtonsContainer1: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-around",
  },
  actionButton1: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0FF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#6C63FF",
    minWidth: 120,
    justifyContent: "center",
  },
  actionButtonText1: {
    color: "#6C63FF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  actionText: { marginLeft: 8, fontSize: 14, color: "#666", fontWeight: "500" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#2C3E50" },
  commentsList: { maxHeight: 300 },
  commentsListContent: { padding: 16 },
  commentItem: {
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#3498DB",
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  commentUser: { fontSize: 14, fontWeight: "bold", color: "#2C3E50" },
  replyButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#3498DB",
    borderRadius: 12,
  },
  replyButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "500" },
  commentText: { fontSize: 14, color: "#34495E", lineHeight: 20 },
  repliesContainer: {
    marginTop: 8,
    marginLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: "#BDC3C7",
    paddingLeft: 8,
  },
  replyItem: {
    backgroundColor: "#ECF0F1",
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  replyText: { fontSize: 13, color: "#34495E", lineHeight: 18 },
  replyingToContainer: {
    backgroundColor: "#E8F4FD",
    padding: 12,
    margin: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  replyingToText: { fontSize: 14, color: "#2C3E50", flex: 1 },
  replyingToComment: { fontWeight: "bold", fontStyle: "italic" },
  cancelReplyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#E74C3C",
    borderRadius: 6,
    marginLeft: 8,
  },
  cancelReplyText: { color: "#FFFFFF", fontSize: 12, fontWeight: "500" },
  inputContainer: { padding: 16, borderTopWidth: 1, borderTopColor: "#E5E5E5" },
  commentInput: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: "#34495E",
    minHeight: 100,
    backgroundColor: "#F8F9FA",
    marginBottom: 16,
  },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 12 },
  cancelButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BDC3C7",
  },
  cancelButtonText: { color: "#7F8C8D", fontSize: 16, fontWeight: "500" },
  submitButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#3498DB",
  },
  fullWidthButton: { flex: 1 },
  submitButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "85%",
    elevation: 5,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0a2a73",
    marginBottom: 15,
  },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 14,
    color: "#000",
  },
  textArea: { height: 80, textAlignVertical: "top" },
  loader: { marginVertical: 20 },
});
