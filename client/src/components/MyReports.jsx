import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContexts";
import { useNavigation } from "@react-navigation/native";
import SidebarNavigation from "./SidebarNavigation";
import { useIsFocused } from "@react-navigation/native";

const statusBadge = (status) => {
  if (!status) return null;
  const normalized = status.toLowerCase();
  if (
    normalized === "in progress" ||
    normalized === "in_progress" ||
    normalized === "active"
  )
    return <Text style={styles.statusInProgress}>In Progress</Text>;
  if (
    normalized === "pending review" ||
    normalized === "pending" ||
    normalized === "pending_review"
  )
    return <Text style={styles.statusPending}>Pending Review</Text>;
  if (normalized === "resolved" || normalized === "completed")
    return <Text style={styles.statusResolved}>Resolved</Text>;
  return <Text style={styles.statusInProgress}>{status}</Text>; // fallback to show unknown status
};

const priorityBadge = (priority) => {
  if (priority === "High") return <Text style={styles.priorityHigh}>High</Text>;
  if (priority === "Medium")
    return <Text style={styles.priorityMedium}>Medium</Text>;
  if (priority === "Low") return <Text style={styles.priorityLow}>Low</Text>;
  return null;
};

const MyReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(
    Dimensions.get("window").width >= 768
  );
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    const onChange = ({ window }) => setIsLargeScreen(window.width >= 768);
    Dimensions.addEventListener("change", onChange);
    return () => Dimensions.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:4000/userReports?user_id=${user?.id}`
        );
        const data = await res.json();
        setReports(data.reports || []);
      } catch (err) {
        setReports([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id && isFocused) fetchReports();
  }, [user, isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.contentRow}>
        {isLargeScreen && <SidebarNavigation />}
        <View style={styles.mainContent}>
          <Text style={styles.header}>All My Reports</Text>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#2563eb"
              style={{ marginTop: 32 }}
            />
          ) : reports.length === 0 ? (
            <Text style={styles.emptyText}>No reports found.</Text>
          ) : (
            <ScrollView>
              {reports.map((report, idx) => (
                <View key={report.id || idx} style={styles.reportCard}>
                  <View>
                    <Text style={styles.title}>{report.title}</Text>
                    <Text style={styles.location}>{report.location}</Text>
                    <Text style={styles.date}>
                      {report.created_at
                        ? new Date(report.created_at).toLocaleDateString()
                        : ""}
                    </Text>
                  </View>
                  <View style={styles.badgeRow}>
                    {statusBadge(report.status)}
                    {priorityBadge(report.priority)}
                    <Text style={styles.eyeIcon}>👁️</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </View>
  );
};

export default MyReports;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  contentRow: {
    flex: 1,
    flexDirection: "row",
  },
  mainContent: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    margin: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  header: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
  reportCard: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#111827",
    marginBottom: 4,
  },
  location: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusInProgress: {
    backgroundColor: "#DBEAFE",
    color: "#2563EB",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 6,
  },
  statusPending: {
    backgroundColor: "#FEF9C3",
    color: "#CA8A04",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 6,
  },
  statusResolved: {
    backgroundColor: "#DCFCE7",
    color: "#16A34A",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 6,
  },
  priorityHigh: {
    backgroundColor: "#FFEDD5",
    color: "#EA580C",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 6,
  },
  priorityMedium: {
    backgroundColor: "#FEF9C3",
    color: "#CA8A04",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 6,
  },
  priorityLow: {
    backgroundColor: "#E0E7FF",
    color: "#6366F1",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 6,
  },
  eyeIcon: {
    marginLeft: 8,
    fontSize: 18,
    color: "#9CA3AF",
  },
  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 32,
    fontSize: 16,
  },
});
