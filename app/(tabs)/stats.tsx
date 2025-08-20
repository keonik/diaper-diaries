import { useEvents } from '@/hooks/use-events';
import { useTheme } from '@/hooks/use-theme';
import { Baby, BarChart3, Calendar, Clock, Droplets, Moon, Ruler, Smartphone, Sun, TrendingUp } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TimePeriod = 'today' | 'week' | 'month';

export default function StatsScreen() {
  const { todayEvents, events } = useEvents();
  const { theme, themeMode, setTheme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('today');

  const getFilteredEvents = (period: TimePeriod) => {
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        startDate.setDate(now.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
        break;
    }
    
    return events.filter(e => e.timestamp >= startDate);
  };

  const stats = useMemo(() => {
    const filteredEvents = getFilteredEvents(selectedPeriod);
    
    const diapers = filteredEvents.filter(e => e.type === 'diaper').length;
    const feedings = filteredEvents.filter(e => e.type === 'bottle' || e.type === 'breastfeed').length;
    
    const totalBreastfeedingTime = filteredEvents
      .filter(e => e.type === 'breastfeed')
      .reduce((acc, e) => acc + (e as any).leftDuration + (e as any).rightDuration, 0);
    
    const totalBottleOunces = filteredEvents
      .filter(e => e.type === 'bottle')
      .reduce((acc, e) => acc + (e as any).ounces, 0);
    
    // Calculate sleep statistics
    const sleepEvents = filteredEvents.filter(e => e.type === 'sleep');
    const totalSleepTime = sleepEvents
      .filter(e => (e as any).status === 'awake' && (e as any).duration)
      .reduce((acc, e) => acc + (e as any).duration, 0);
    
    const sleepSessions = sleepEvents.filter(e => (e as any).status === 'asleep').length;
    const avgSleepSession = sleepSessions > 0 ? totalSleepTime / sleepSessions : 0;
    
    const latestMeasurement = events
      .filter(e => e.type === 'measurement')
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
    
    // Calculate averages for weekly/monthly views
    const days = selectedPeriod === 'today' ? 1 : selectedPeriod === 'week' ? 7 : 30;
    const avgDiapers = selectedPeriod === 'today' ? diapers : (diapers / days).toFixed(1);
    const avgFeedings = selectedPeriod === 'today' ? feedings : (feedings / days).toFixed(1);
    const avgNursingTime = selectedPeriod === 'today' ? totalBreastfeedingTime : (totalBreastfeedingTime / days);
    const avgBottleOunces = selectedPeriod === 'today' ? totalBottleOunces : (totalBottleOunces / days).toFixed(1);
    const avgSleepTime = selectedPeriod === 'today' ? totalSleepTime : (totalSleepTime / days);
    const avgSleepSessions = selectedPeriod === 'today' ? sleepSessions : (sleepSessions / days).toFixed(1);
    
    return {
      diapers,
      feedings,
      totalBreastfeedingTime,
      totalBottleOunces,
      totalSleepTime,
      sleepSessions,
      avgSleepSession,
      avgDiapers,
      avgFeedings,
      avgNursingTime,
      avgBottleOunces,
      avgSleepTime,
      avgSleepSessions,
      latestWeight: (latestMeasurement as any)?.weight,
      latestHeight: (latestMeasurement as any)?.height,
    };
  }, [selectedPeriod, events]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} minutes`;
  };
  
  const getMostActiveTime = (events: any[]) => {
    if (events.length === 0) return 'No data';
    
    const hourCounts = new Array(24).fill(0);
    events.forEach(event => {
      const hour = event.timestamp.getHours();
      hourCounts[hour]++;
    });
    
    const maxHour = hourCounts.indexOf(Math.max(...hourCounts));
    const period = maxHour < 12 ? 'AM' : 'PM';
    const displayHour = maxHour === 0 ? 12 : maxHour > 12 ? maxHour - 12 : maxHour;
    
    return `${displayHour}:00 ${period}`;
  };
  
  const getFeedingPattern = (events: any[]) => {
    const feedings = events.filter(e => e.type === 'bottle' || e.type === 'breastfeed');
    if (feedings.length === 0) return 'No feedings';
    
    const breastfeeds = feedings.filter(e => e.type === 'breastfeed').length;
    const bottles = feedings.filter(e => e.type === 'bottle').length;
    
    if (breastfeeds > bottles * 2) return 'Mostly nursing';
    if (bottles > breastfeeds * 2) return 'Mostly bottle';
    return 'Mixed feeding';
  };
  
  const getPreviousPeriodStats = () => {
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();
    
    switch (selectedPeriod) {
      case 'week':
        startDate.setDate(now.getDate() - 14);
        endDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setDate(now.getDate() - 60);
        endDate.setDate(now.getDate() - 30);
        break;
      default:
        return null;
    }
    
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    
    const previousEvents = events.filter(e => e.timestamp >= startDate && e.timestamp <= endDate);
    
    const diapers = previousEvents.filter(e => e.type === 'diaper').length;
    const feedings = previousEvents.filter(e => e.type === 'bottle' || e.type === 'breastfeed').length;
    const nursingTime = previousEvents
      .filter(e => e.type === 'breastfeed')
      .reduce((acc, e) => acc + (e as any).leftDuration + (e as any).rightDuration, 0);
    const sleepTime = previousEvents
      .filter(e => e.type === 'sleep' && (e as any).status === 'awake' && (e as any).duration)
      .reduce((acc, e) => acc + (e as any).duration, 0);
    
    return { diapers, feedings, nursingTime, sleepTime };
  };
  
  const renderComparison = () => {
    const previous = getPreviousPeriodStats();
    if (!previous) return null;
    
    const diaperChange = ((stats.diapers - previous.diapers) / Math.max(previous.diapers, 1) * 100).toFixed(0);
    const feedingChange = ((stats.feedings - previous.feedings) / Math.max(previous.feedings, 1) * 100).toFixed(0);
    const nursingChange = ((stats.totalBreastfeedingTime - previous.nursingTime) / Math.max(previous.nursingTime, 1) * 100).toFixed(0);
    const sleepChange = ((stats.totalSleepTime - previous.sleepTime) / Math.max(previous.sleepTime, 1) * 100).toFixed(0);
    
    return (
      <View style={styles.comparisonItems}>
        <View style={styles.comparisonItem}>
          <Text style={[styles.comparisonLabel, { color: theme.text.secondary }]}>Diapers</Text>
          <Text style={[styles.comparisonValue, { color: parseInt(diaperChange) >= 0 ? theme.warning : theme.success }]}>
            {parseInt(diaperChange) >= 0 ? '+' : ''}{diaperChange}%
          </Text>
        </View>
        <View style={styles.comparisonItem}>
          <Text style={[styles.comparisonLabel, { color: theme.text.secondary }]}>Feedings</Text>
          <Text style={[styles.comparisonValue, { color: parseInt(feedingChange) >= 0 ? theme.success : theme.error }]}>
            {parseInt(feedingChange) >= 0 ? '+' : ''}{feedingChange}%
          </Text>
        </View>
        {stats.totalBreastfeedingTime > 0 && (
          <View style={styles.comparisonItem}>
            <Text style={[styles.comparisonLabel, { color: theme.text.secondary }]}>Nursing</Text>
            <Text style={[styles.comparisonValue, { color: parseInt(nursingChange) >= 0 ? theme.success : theme.error }]}>
              {parseInt(nursingChange) >= 0 ? '+' : ''}{nursingChange}%
            </Text>
          </View>
        )}
        {stats.totalSleepTime > 0 && (
          <View style={styles.comparisonItem}>
            <Text style={[styles.comparisonLabel, { color: theme.text.secondary }]}>Sleep</Text>
            <Text style={[styles.comparisonValue, { color: parseInt(sleepChange) >= 0 ? theme.success : theme.error }]}>
              {parseInt(sleepChange) >= 0 ? '+' : ''}{sleepChange}%
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text.primary }]}>
            {selectedPeriod === 'today' ? "Today's Summary" : 
             selectedPeriod === 'week' ? 'Weekly Summary' : 'Monthly Summary'}
          </Text>
          
          <View style={styles.themeSelector}>
            <TouchableOpacity
              style={[styles.themeButton, themeMode === 'light' && { backgroundColor: theme.primary }]}
              onPress={() => setTheme('light')}
            >
              <Sun size={16} color={themeMode === 'light' ? theme.text.inverse : theme.text.secondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.themeButton, themeMode === 'system' && { backgroundColor: theme.primary }]}
              onPress={() => setTheme('system')}
            >
              <Smartphone size={16} color={themeMode === 'system' ? theme.text.inverse : theme.text.secondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.themeButton, themeMode === 'dark' && { backgroundColor: theme.primary }]}
              onPress={() => setTheme('dark')}
            >
              <Moon size={16} color={themeMode === 'dark' ? theme.text.inverse : theme.text.secondary} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={[styles.periodSelector, { backgroundColor: theme.surface }]}>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'today' && { backgroundColor: theme.primary }]}
            onPress={() => setSelectedPeriod('today')}
          >
            <Calendar size={16} color={selectedPeriod === 'today' ? theme.text.inverse : theme.text.secondary} />
            <Text style={[styles.periodText, { color: selectedPeriod === 'today' ? theme.text.inverse : theme.text.secondary }]}>Today</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'week' && { backgroundColor: theme.primary }]}
            onPress={() => setSelectedPeriod('week')}
          >
            <TrendingUp size={16} color={selectedPeriod === 'week' ? theme.text.inverse : theme.text.secondary} />
            <Text style={[styles.periodText, { color: selectedPeriod === 'week' ? theme.text.inverse : theme.text.secondary }]}>Week</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'month' && { backgroundColor: theme.primary }]}
            onPress={() => setSelectedPeriod('month')}
          >
            <BarChart3 size={16} color={selectedPeriod === 'month' ? theme.text.inverse : theme.text.secondary} />
            <Text style={[styles.periodText, { color: selectedPeriod === 'month' ? theme.text.inverse : theme.text.secondary }]}>Month</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: theme.diaper.pee + '20', shadowColor: theme.shadow }]}>
            <Droplets size={24} color={theme.diaper.poop} />
            <Text style={[styles.statValue, { color: theme.text.primary }]}>{stats.diapers}</Text>
            <Text style={[styles.statLabel, { color: theme.text.secondary }]}>Diaper Changes</Text>
            {selectedPeriod !== 'today' && (
              <Text style={[styles.avgLabel, { color: theme.text.light }]}>Avg: {stats.avgDiapers}/day</Text>
            )}
          </View>
          
          <View style={[styles.statCard, { backgroundColor: theme.feeding.breast + '20', shadowColor: theme.shadow }]}>
            <Baby size={24} color={theme.feeding.breast} />
            <Text style={[styles.statValue, { color: theme.text.primary }]}>{stats.feedings}</Text>
            <Text style={[styles.statLabel, { color: theme.text.secondary }]}>Feedings</Text>
            {selectedPeriod !== 'today' && (
              <Text style={[styles.avgLabel, { color: theme.text.light }]}>Avg: {stats.avgFeedings}/day</Text>
            )}
          </View>
        </View>
        
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: theme.sleep.asleep + '20', shadowColor: theme.shadow }]}>
            <Moon size={24} color={theme.sleep.asleep} />
            <Text style={[styles.statValue, { color: theme.text.primary }]}>{formatDuration(stats.totalSleepTime)}</Text>
            <Text style={[styles.statLabel, { color: theme.text.secondary }]}>Total Sleep</Text>
            {selectedPeriod !== 'today' && (
              <Text style={[styles.avgLabel, { color: theme.text.light }]}>Avg: {formatDuration(stats.avgSleepTime)}/day</Text>
            )}
          </View>
          
          <View style={[styles.statCard, { backgroundColor: theme.sleep.awake + '20', shadowColor: theme.shadow }]}>
            <Sun size={24} color={theme.sleep.awake} />
            <Text style={[styles.statValue, { color: theme.text.primary }]}>{stats.sleepSessions}</Text>
            <Text style={[styles.statLabel, { color: theme.text.secondary }]}>Sleep Sessions</Text>
            {selectedPeriod !== 'today' && (
              <Text style={[styles.avgLabel, { color: theme.text.light }]}>Avg: {stats.avgSleepSessions}/day</Text>
            )}
          </View>
        </View>
        
        <View style={styles.detailsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Feeding Details</Text>
          
          {stats.totalBreastfeedingTime > 0 && (
            <View style={[styles.detailCard, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
              <View style={[styles.detailIcon, { backgroundColor: theme.background }]}>
                <Clock size={20} color={theme.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: theme.text.secondary }]}>
                  {selectedPeriod === 'today' ? 'Nursing Time' : `Total Nursing (${selectedPeriod})`}
                </Text>
                <Text style={[styles.detailValue, { color: theme.text.primary }]}>{formatDuration(stats.totalBreastfeedingTime)}</Text>
                {selectedPeriod !== 'today' && (
                  <Text style={[styles.avgText, { color: theme.text.light }]}>Avg: {formatDuration(stats.avgNursingTime)}/day</Text>
                )}
              </View>
            </View>
          )}
          
          {stats.totalBottleOunces > 0 && (
            <View style={[styles.detailCard, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
              <View style={[styles.detailIcon, { backgroundColor: theme.background }]}>
                <Baby size={20} color={theme.feeding.bottle} />
              </View>
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: theme.text.secondary }]}>
                  {selectedPeriod === 'today' ? 'Bottle Total' : `Total Bottle (${selectedPeriod})`}
                </Text>
                <Text style={[styles.detailValue, { color: theme.text.primary }]}>{stats.totalBottleOunces} oz</Text>
                {selectedPeriod !== 'today' && (
                  <Text style={[styles.avgText, { color: theme.text.light }]}>Avg: {stats.avgBottleOunces} oz/day</Text>
                )}
              </View>
            </View>
          )}
        </View>
        
        {stats.totalSleepTime > 0 && (
          <View style={styles.detailsSection}>
            <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Sleep Details</Text>
            
            <View style={[styles.detailCard, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
              <View style={[styles.detailIcon, { backgroundColor: theme.background }]}>
                <Moon size={20} color={theme.sleep.asleep} />
              </View>
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: theme.text.secondary }]}>Average Sleep Session</Text>
                <Text style={[styles.detailValue, { color: theme.text.primary }]}>{formatDuration(stats.avgSleepSession)}</Text>
              </View>
            </View>
          </View>
        )}
        
        {selectedPeriod !== 'today' && (
          <View style={styles.detailsSection}>
            <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Trends & Patterns</Text>
            
            <View style={styles.trendsContainer}>
              <View style={[styles.trendCard, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
                <Text style={[styles.trendTitle, { color: theme.text.secondary }]}>Most Active Time</Text>
                <Text style={[styles.trendValue, { color: theme.text.primary }]}>{getMostActiveTime(getFilteredEvents(selectedPeriod))}</Text>
              </View>
              
              <View style={[styles.trendCard, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
                <Text style={[styles.trendTitle, { color: theme.text.secondary }]}>Feeding Pattern</Text>
                <Text style={[styles.trendValue, { color: theme.text.primary }]}>{getFeedingPattern(getFilteredEvents(selectedPeriod))}</Text>
              </View>
            </View>
            
            <View style={[styles.comparisonCard, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
              <Text style={[styles.comparisonTitle, { color: theme.text.primary }]}>Comparison to Previous Period</Text>
              {renderComparison()}
            </View>
          </View>
        )}
        
        {(stats.latestWeight || stats.latestHeight) && (
          <View style={styles.detailsSection}>
            <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Latest Measurements</Text>
            
            {stats.latestWeight && (
              <View style={[styles.detailCard, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
                <View style={[styles.detailIcon, { backgroundColor: theme.background }]}>
                  <Ruler size={20} color={theme.success} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={[styles.detailLabel, { color: theme.text.secondary }]}>Weight</Text>
                  <Text style={[styles.detailValue, { color: theme.text.primary }]}>{stats.latestWeight} lbs</Text>
                </View>
              </View>
            )}
            
            {stats.latestHeight && (
              <View style={[styles.detailCard, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
                <View style={[styles.detailIcon, { backgroundColor: theme.background }]}>
                  <Ruler size={20} color={theme.success} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={[styles.detailLabel, { color: theme.text.secondary }]}>Height</Text>
                  <Text style={[styles.detailValue, { color: theme.text.primary }]}>{stats.latestHeight} inches</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  themeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  themeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
  },
  detailsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  detailCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  periodSelector: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  periodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
  },
  avgLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  avgText: {
    fontSize: 14,
    marginTop: 2,
  },
  trendsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  trendCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  trendTitle: {
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  trendValue: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  comparisonCard: {
    padding: 16,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  comparisonItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  comparisonItem: {
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  comparisonValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});