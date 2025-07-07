import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
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
  Plus,
  Eye,
  MapPin,
  Calendar,
  Star,
  TrendingUp,
  Shield,
  Zap,
  Bell,
  Camera,
  LayoutDashboard,
  ListTodo,
  ListChecks,
  Users,
  BarChart,
  UserCircle,
  HelpCircle,
} from "lucide-react-native";
import LayoutWrapper from "../src/components/LayoutWrapper";

const { width } = Dimensions.get("window");

const GettingStarted = () => {
  const gettingStartedSections = [
    {
      title: "Dashboard Overview",
      icon: <LayoutDashboard size={24} color="#2563EB" />,
      description: "Understanding your main dashboard and key metrics",
      content: [
        "View real-time maintenance statistics",
        "Monitor report status and progress",
        "Access quick actions and shortcuts",
        "Track performance metrics and trends",
      ],
    },
    {
      title: "Creating Reports",
      icon: <Plus size={24} color="#2563EB" />,
      description: "How to submit new maintenance requests",
      content: [
        "Click the 'New Report' button",
        "Fill in location and description details",
        "Select priority level and category",
        "Add photos or attachments if needed",
        "Submit and track your request",
      ],
    },
    {
      title: "Managing Reports",
      icon: <ListTodo size={24} color="#2563EB" />,
      description: "Viewing and updating maintenance reports",
      content: [
        "Browse all reports in the system",
        "Filter by status, priority, or location",
        "Update report status and progress",
        "Add comments and notes",
        "Assign reports to maintenance staff",
      ],
    },
    {
      title: "User Management",
      icon: <Users size={24} color="#2563EB" />,
      description: "Managing maintenance personnel and assignments",
      content: [
        "View all maintenance staff profiles",
        "Assign reports to specific personnel",
        "Track workload and availability",
        "Manage user roles and permissions",
        "Monitor performance and completion rates",
      ],
    },
    {
      title: "Analytics & Insights",
      icon: <BarChart size={24} color="#2563EB" />,
      description: "Understanding performance metrics and reports",
      content: [
        "View completion rates and trends",
        "Analyze response times and efficiency",
        "Generate detailed performance reports",
        "Track maintenance costs and budgets",
        "Identify areas for improvement",
      ],
    },
    {
      title: "Profile & Settings",
      icon: <UserCircle size={24} color="#2563EB" />,
      description: "Managing your account and preferences",
      content: [
        "Update personal information",
        "Change password and security settings",
        "Configure notification preferences",
        "Set default locations and categories",
        "Manage account permissions",
      ],
    },
  ];

  const quickTips = [
    {
      tip: "Use the search function to quickly find specific reports",
      icon: <Eye size={16} color="#10B981" />,
    },
    {
      tip: "Set up notifications to stay updated on report status changes",
      icon: <Bell size={16} color="#10B981" />,
    },
    {
      tip: "Use the priority system to ensure urgent issues are addressed first",
      icon: <AlertCircle size={16} color="#F59E0B" />,
    },
    {
      tip: "Add detailed descriptions and photos to help maintenance staff",
      icon: <Camera size={16} color="#10B981" />,
    },
    {
      tip: "Regularly check the analytics dashboard for insights",
      icon: <TrendingUp size={16} color="#10B981" />,
    },
  ];

  const statusGuide = [
    {
      status: "New",
      color: "#4F46E5",
      bgColor: "#E0E7FF",
      description: "Recently submitted reports awaiting assignment",
    },
    {
      status: "In Progress",
      color: "#2563EB",
      bgColor: "#DBEAFE",
      description: "Currently being worked on by maintenance staff",
    },
    {
      status: "Pending Review",
      color: "#D97706",
      bgColor: "#FEF3C7",
      description: "Awaiting approval or inspection",
    },
    {
      status: "Resolved",
      color: "#10B981",
      bgColor: "#D1FAE5",
      description: "Work completed and verified",
    },
    {
      status: "Overdue",
      color: "#EF4444",
      bgColor: "#FEE2E2",
      description: "Past the expected completion date",
    },
  ];

  return (
    <LayoutWrapper>
      <ScrollView style={styles.mainContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Getting Started</Text>
          <Text style={styles.pageSubtitle}>
            Everything you need to know about using the TunzaSU maintenance
            dashboard
          </Text>
        </View>

        {/* Welcome Section */}
        <View style={styles.section}>
          <View style={styles.welcomeCard}>
            <View style={styles.welcomeIcon}>
              <Zap size={32} color="#2563EB" />
            </View>
            <Text style={styles.welcomeTitle}>Welcome to TunzaSU!</Text>
            <Text style={styles.welcomeDescription}>
              This comprehensive guide will help you understand how to
              effectively use the maintenance dashboard. Whether you're
              submitting reports, managing assignments, or analyzing
              performance, we've got you covered.
            </Text>
          </View>
        </View>

        {/* Getting Started Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Core Features</Text>
          <View style={styles.featuresGrid}>
            {gettingStartedSections.map((section, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureHeader}>
                  <View style={styles.featureIcon}>{section.icon}</View>
                  <Text style={styles.featureTitle}>{section.title}</Text>
                </View>
                <Text style={styles.featureDescription}>
                  {section.description}
                </Text>
                <View style={styles.featureList}>
                  {section.content.map((item, itemIndex) => (
                    <View key={itemIndex} style={styles.featureItem}>
                      <CheckCircle
                        size={16}
                        color="#10B981"
                        style={styles.featureBullet}
                      />
                      <Text style={styles.featureText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Status Guide */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Understanding Report Status</Text>
          <View style={styles.statusGuide}>
            {statusGuide.map((status, index) => (
              <View key={index} style={styles.statusItem}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: status.bgColor },
                  ]}
                >
                  <Text style={[styles.statusText, { color: status.color }]}>
                    {status.status}
                  </Text>
                </View>
                <Text style={styles.statusDescription}>
                  {status.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Tips</Text>
          <View style={styles.tipsGrid}>
            {quickTips.map((tip, index) => (
              <View key={index} style={styles.tipCard}>
                <View style={styles.tipIcon}>{tip.icon}</View>
                <Text style={styles.tipText}>{tip.tip}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Next Steps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Steps</Text>
          <View style={styles.nextStepsCard}>
            <Text style={styles.nextStepsTitle}>Ready to get started?</Text>
            <Text style={styles.nextStepsDescription}>
              Now that you understand the basics, here's what you can do next:
            </Text>
            <View style={styles.nextStepsList}>
              <TouchableOpacity
                style={styles.nextStepButton}
                onPress={() => navigation.navigate("Dashboard")}
              >
                <LayoutDashboard size={20} color="#FFFFFF" />
                <Text style={styles.nextStepButtonText}>Go to Dashboard</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.nextStepButton}
                onPress={() => navigation.navigate("AllReports")}
              >
                <ListTodo size={20} color="#FFFFFF" />
                <Text style={styles.nextStepButtonText}>View All Reports</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.nextStepButton}
                onPress={() => navigation.navigate("Help")}
              >
                <HelpCircle size={20} color="#FFFFFF" />
                <Text style={styles.nextStepButtonText}>Get Help</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </LayoutWrapper>
  );
};

const styles = StyleSheet.create({
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
  welcomeCard: {
    backgroundColor: "#FFFFFF",
    padding: 32,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    alignItems: "center",
    textAlign: "center",
  },
  welcomeIcon: {
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
    textAlign: "center",
  },
  welcomeDescription: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
    textAlign: "center",
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
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
  featureHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureIcon: {
    marginRight: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    flex: 1,
  },
  featureDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 16,
  },
  featureList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  featureBullet: {
    marginRight: 8,
    marginTop: 2,
  },
  featureText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    flex: 1,
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
  tipsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tipCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    width: (width - 64 - 32) / 2 - 12,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  tipIcon: {
    marginRight: 12,
  },
  tipText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    flex: 1,
  },
  nextStepsCard: {
    backgroundColor: "#FFFFFF",
    padding: 32,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  nextStepsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
  },
  nextStepsDescription: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
    marginBottom: 24,
  },
  nextStepsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  nextStepButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    width: (width - 64 - 32) / 3 - 16,
    marginBottom: 16,
  },
  nextStepButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default GettingStarted;
