import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  LayoutDashboard,
  ListTodo,
  ListChecks,
  Users,
  BarChart,
  UserCircle,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  MessageCircle,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

const Help = () => {
  const navigation = useNavigation();

  const faqData = [
    {
      question: "How do I view all reports?",
      answer:
        "Click on 'All Reports' in the sidebar to view all maintenance reports. You can filter by status, priority, or assigned personnel.",
    },
    {
      question: "How do I assign a report to someone?",
      answer:
        "Go to the report details and click on 'Assign'. Select the appropriate maintenance personnel from the dropdown list.",
    },
    {
      question: "What do the different status badges mean?",
      answer:
        "New: Recently submitted reports. In Progress: Currently being worked on. Pending Review: Awaiting approval. Resolved: Completed work. Overdue: Past due date.",
    },
    {
      question: "How do I update a report status?",
      answer:
        "Click on the report to view details, then use the status dropdown to update the current status of the maintenance work.",
    },
    {
      question: "Can I generate reports for analytics?",
      answer:
        "Yes, click on 'Analytics' in the sidebar to view performance metrics, completion rates, and generate detailed reports.",
    },
  ];

  const quickGuides = [
    {
      title: "Getting Started",
      icon: <BookOpen size={24} color="#2563EB" />,
      description: "Learn the basics of using the maintenance dashboard",
    },
    {
      title: "Report Management",
      icon: <ListTodo size={24} color="#2563EB" />,
      description: "How to create, edit, and track maintenance reports",
    },
    {
      title: "User Management",
      icon: <Users size={24} color="#2563EB" />,
      description: "Managing maintenance personnel and assignments",
    },
    {
      title: "Analytics & Reports",
      icon: <BarChart size={24} color="#2563EB" />,
      description: "Understanding performance metrics and generating reports",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>T</Text>
          </View>
          <Text style={styles.appTitle}>TunzaSU</Text>
        </View>
        <Text style={styles.dashboardSubtitle}>Maintenance Dashboard</Text>
        <View style={styles.navContainer}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("MainTabs")}
          >
            <LayoutDashboard size={20} color="#4B5563" style={styles.navIcon} />
            <Text style={styles.navText}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("AllReports")}
          >
            <ListTodo size={20} color="#4B5563" style={styles.navIcon} />
            <Text style={styles.navText}>All Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <ListChecks size={20} color="#4B5563" style={styles.navIcon} />
            <Text style={styles.navText}>Assigned Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Users size={20} color="#4B5563" style={styles.navIcon} />
            <Text style={styles.navText}>Manage Users</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <BarChart size={20} color="#4B5563" style={styles.navIcon} />
            <Text style={styles.navText}>Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("Profile")}
          >
            <UserCircle size={20} color="#4B5563" style={styles.navIcon} />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
            <HelpCircle size={20} color="#2563EB" style={styles.navIcon} />
            <Text style={[styles.navText, styles.activeNavText]}>Help</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.mainContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Help & Support</Text>
          <Text style={styles.pageSubtitle}>
            Get assistance with using the maintenance dashboard
          </Text>
        </View>

        {/* Quick Guides */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Guides</Text>
          <View style={styles.guidesGrid}>
            {quickGuides.map((guide, index) => (
              <TouchableOpacity key={index} style={styles.guideCard}>
                <View style={styles.guideIcon}>{guide.icon}</View>
                <Text style={styles.guideTitle}>{guide.title}</Text>
                <Text style={styles.guideDescription}>{guide.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqList}>
            {faqData.map((faq, index) => (
              <View key={index} style={styles.faqItem}>
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <ChevronRight size={20} color="#6B7280" />
                </View>
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Status Guide */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Understanding Report Status</Text>
          <View style={styles.statusGuide}>
            <View style={styles.statusItem}>
              <View
                style={[styles.statusBadge, { backgroundColor: "#E0E7FF" }]}
              >
                <Text style={[styles.statusText, { color: "#4F46E5" }]}>
                  New
                </Text>
              </View>
              <Text style={styles.statusDescription}>
                Recently submitted reports awaiting assignment
              </Text>
            </View>
            <View style={styles.statusItem}>
              <View
                style={[styles.statusBadge, { backgroundColor: "#DBEAFE" }]}
              >
                <Text style={[styles.statusText, { color: "#2563EB" }]}>
                  In Progress
                </Text>
              </View>
              <Text style={styles.statusDescription}>
                Currently being worked on by maintenance staff
              </Text>
            </View>
            <View style={styles.statusItem}>
              <View
                style={[styles.statusBadge, { backgroundColor: "#FEF3C7" }]}
              >
                <Text style={[styles.statusText, { color: "#D97706" }]}>
                  Pending Review
                </Text>
              </View>
              <Text style={styles.statusDescription}>
                Awaiting approval or inspection
              </Text>
            </View>
            <View style={styles.statusItem}>
              <View
                style={[styles.statusBadge, { backgroundColor: "#D1FAE5" }]}
              >
                <Text style={[styles.statusText, { color: "#10B981" }]}>
                  Resolved
                </Text>
              </View>
              <Text style={styles.statusDescription}>
                Work completed and verified
              </Text>
            </View>
            <View style={styles.statusItem}>
              <View
                style={[styles.statusBadge, { backgroundColor: "#FEE2E2" }]}
              >
                <Text style={[styles.statusText, { color: "#EF4444" }]}>
                  Overdue
                </Text>
              </View>
              <Text style={styles.statusDescription}>
                Past the expected completion date
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          <View style={styles.contactGrid}>
            <TouchableOpacity style={styles.contactCard}>
              <Mail size={24} color="#2563EB" />
              <Text style={styles.contactTitle}>Email Support</Text>
              <Text style={styles.contactInfo}>support@tunzasu.com</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactCard}>
              <Phone size={24} color="#2563EB" />
              <Text style={styles.contactTitle}>Phone Support</Text>
              <Text style={styles.contactInfo}>+254 700 000 000</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: 256,
    backgroundColor: "#FFFFFF",
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  logoCircle: {
    width: 40,
    height: 40,
    backgroundColor: "#2563EB",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  appTitle: {
    marginLeft: 12,
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
  },
  dashboardSubtitle: {
    color: "#6B7280",
    fontSize: 14,
    marginBottom: 24,
  },
  navContainer: {
    flexGrow: 1,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  activeNavItem: {
    backgroundColor: "#DBEAFE",
  },
  navIcon: {
    marginRight: 12,
  },
  navText: {
    color: "#4B5563",
    fontWeight: "500",
  },
  activeNavText: {
    color: "#2563EB",
  },
  mainContent: {
    flex: 1,
    padding: 32,
    backgroundColor: "#F3F4F6",
  },
  header: {
    marginBottom: 32,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  guidesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  guideCard: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    width: (width - 64 - 32) / 2 - 12,
    marginBottom: 16,
  },
  guideIcon: {
    marginBottom: 12,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  guideDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  faqList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  faqItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    flex: 1,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  statusGuide: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    marginRight: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusDescription: {
    fontSize: 14,
    color: "#6B7280",
    flex: 1,
  },
  contactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  contactCard: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    alignItems: "center",
    width: (width - 64 - 32) / 3 - 16,
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 12,
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});

export default Help;
