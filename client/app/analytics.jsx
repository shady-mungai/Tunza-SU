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
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Download,
  Filter,
  Eye,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

const Analytics = () => {
  const navigation = useNavigation();

  // Mock analytics data
  const analyticsData = {
    totalReports: 156,
    resolvedReports: 89,
    pendingReports: 45,
    overdueReports: 22,
    avgResolutionTime: "3.2 days",
    completionRate: "57%",
    monthlyTrend: "+12%",
    topIssues: [
      { issue: "Electrical Problems", count: 28, percentage: 18 },
      { issue: "Plumbing Issues", count: 24, percentage: 15 },
      { issue: "HVAC Maintenance", count: 19, percentage: 12 },
      { issue: "Structural Repairs", count: 15, percentage: 10 },
    ],
    monthlyStats: [
      { month: "Jan", reports: 45, resolved: 32 },
      { month: "Feb", reports: 38, resolved: 28 },
      { month: "Mar", reports: 52, resolved: 41 },
      { month: "Apr", reports: 41, resolved: 35 },
      { month: "May", reports: 48, resolved: 39 },
      { month: "Jun", reports: 55, resolved: 42 },
    ],
    performanceMetrics: [
      {
        metric: "Response Time",
        value: "2.1 hours",
        trend: "up",
        change: "+15%",
      },
      {
        metric: "Resolution Time",
        value: "3.2 days",
        trend: "down",
        change: "-8%",
      },
      {
        metric: "Customer Satisfaction",
        value: "4.6/5",
        trend: "up",
        change: "+12%",
      },
      {
        metric: "First-Time Fix Rate",
        value: "78%",
        trend: "up",
        change: "+5%",
      },
    ],
  };

  const renderProgressBar = (percentage, color) => (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { backgroundColor: "#E5E7EB" }]}>
        <View
          style={[
            styles.progressFill,
            { width: `${percentage}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={styles.progressText}>{percentage}%</Text>
    </View>
  );

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
            onPress={() => navigation.navigate("Dashboard")}
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
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("AssignedReports")}
          >
            <ListChecks size={20} color="#4B5563" style={styles.navIcon} />
            <Text style={styles.navText}>Assigned Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
            <BarChart size={20} color="#2563EB" style={styles.navIcon} />
            <Text style={[styles.navText, styles.activeNavText]}>
              Analytics
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("Profile")}
          >
            <UserCircle size={20} color="#4B5563" style={styles.navIcon} />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("Help")}
          >
            <HelpCircle size={20} color="#4B5563" style={styles.navIcon} />
            <Text style={styles.navText}>Help</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.mainContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.pageTitle}>Analytics</Text>
            <Text style={styles.pageSubtitle}>
              Performance metrics and insights
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Filter size={16} color="#2563EB" />
              <Text style={styles.actionText}>Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Download size={16} color="#2563EB" />
              <Text style={styles.actionText}>Export</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Key Metrics Cards */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Total Reports</Text>
              <BarChart size={20} color="#2563EB" />
            </View>
            <Text style={styles.metricValue}>{analyticsData.totalReports}</Text>
            <View style={styles.metricTrend}>
              <TrendingUp size={16} color="#10B981" />
              <Text style={[styles.trendText, { color: "#10B981" }]}>
                +12% this month
              </Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Resolved</Text>
              <CheckCircle size={20} color="#10B981" />
            </View>
            <Text style={styles.metricValue}>
              {analyticsData.resolvedReports}
            </Text>
            <View style={styles.metricTrend}>
              <TrendingUp size={16} color="#10B981" />
              <Text style={[styles.trendText, { color: "#10B981" }]}>
                +8% this month
              </Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Pending</Text>
              <Clock size={20} color="#F59E0B" />
            </View>
            <Text style={styles.metricValue}>
              {analyticsData.pendingReports}
            </Text>
            <View style={styles.metricTrend}>
              <TrendingDown size={16} color="#EF4444" />
              <Text style={[styles.trendText, { color: "#EF4444" }]}>
                -5% this month
              </Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Overdue</Text>
              <AlertTriangle size={20} color="#EF4444" />
            </View>
            <Text style={styles.metricValue}>
              {analyticsData.overdueReports}
            </Text>
            <View style={styles.metricTrend}>
              <TrendingDown size={16} color="#10B981" />
              <Text style={[styles.trendText, { color: "#10B981" }]}>
                -15% this month
              </Text>
            </View>
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          <View style={styles.performanceGrid}>
            {analyticsData.performanceMetrics.map((metric, index) => (
              <View key={index} style={styles.performanceCard}>
                <Text style={styles.performanceLabel}>{metric.metric}</Text>
                <Text style={styles.performanceValue}>{metric.value}</Text>
                <View style={styles.performanceTrend}>
                  {metric.trend === "up" ? (
                    <TrendingUp size={16} color="#10B981" />
                  ) : (
                    <TrendingDown size={16} color="#EF4444" />
                  )}
                  <Text
                    style={[
                      styles.trendText,
                      { color: metric.trend === "up" ? "#10B981" : "#EF4444" },
                    ]}
                  >
                    {metric.change}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Top Issues */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Issues by Category</Text>
          <View style={styles.issuesCard}>
            {analyticsData.topIssues.map((issue, index) => (
              <View key={index} style={styles.issueItem}>
                <View style={styles.issueInfo}>
                  <Text style={styles.issueName}>{issue.issue}</Text>
                  <Text style={styles.issueCount}>{issue.count} reports</Text>
                </View>
                {renderProgressBar(issue.percentage, "#2563EB")}
              </View>
            ))}
          </View>
        </View>

        {/* Monthly Trends */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Trends</Text>
          <View style={styles.trendsCard}>
            <View style={styles.trendsHeader}>
              <Text style={styles.trendsLabel}>Reports vs Resolved</Text>
            </View>
            <View style={styles.trendsChart}>
              {analyticsData.monthlyStats.map((stat, index) => (
                <View key={index} style={styles.monthBar}>
                  <Text style={styles.monthLabel}>{stat.month}</Text>
                  <View style={styles.barContainer}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: (stat.reports / 60) * 100,
                          backgroundColor: "#DBEAFE",
                        },
                      ]}
                    />
                    <View
                      style={[
                        styles.bar,
                        {
                          height: (stat.resolved / 60) * 100,
                          backgroundColor: "#2563EB",
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{stat.reports}</Text>
                </View>
              ))}
            </View>
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendColor, { backgroundColor: "#DBEAFE" }]}
                />
                <Text style={styles.legendText}>Total Reports</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendColor, { backgroundColor: "#2563EB" }]}
                />
                <Text style={styles.legendText}>Resolved</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Eye size={24} color="#2563EB" />
              <Text style={styles.actionCardTitle}>View Detailed Report</Text>
              <Text style={styles.actionCardSubtitle}>
                Generate comprehensive analytics report
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Download size={24} color="#2563EB" />
              <Text style={styles.actionCardTitle}>Export Data</Text>
              <Text style={styles.actionCardSubtitle}>
                Download analytics data as CSV
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Calendar size={24} color="#2563EB" />
              <Text style={styles.actionCardTitle}>Schedule Report</Text>
              <Text style={styles.actionCardSubtitle}>
                Set up automated report delivery
              </Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#2563EB",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  metricCard: {
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
  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  metricValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  metricTrend: {
    flexDirection: "row",
    alignItems: "center",
  },
  trendText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
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
  performanceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  performanceCard: {
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
  },
  performanceLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  performanceValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  performanceTrend: {
    flexDirection: "row",
    alignItems: "center",
  },
  issuesCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  issueItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  issueInfo: {
    flex: 1,
  },
  issueName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 4,
  },
  issueCount: {
    fontSize: 14,
    color: "#6B7280",
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 120,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
  },
  trendsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  trendsHeader: {
    marginBottom: 20,
  },
  trendsLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  trendsChart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
    marginBottom: 16,
  },
  monthBar: {
    alignItems: "center",
    flex: 1,
  },
  monthLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
  },
  barContainer: {
    flex: 1,
    justifyContent: "flex-end",
    width: 20,
    marginBottom: 8,
  },
  bar: {
    width: "100%",
    borderRadius: 2,
    marginBottom: 2,
  },
  barLabel: {
    fontSize: 10,
    color: "#6B7280",
  },
  chartLegend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: "#6B7280",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
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
  actionCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 12,
    marginBottom: 4,
  },
  actionCardSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
});

export default Analytics;
