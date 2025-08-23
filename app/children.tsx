import { useChildren } from '@/hooks/use-children';
import { useTheme } from '@/hooks/use-theme';
import { Stack, router } from 'expo-router';
import { Check, Edit, Plus, Trash2 } from 'lucide-react-native';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChildrenScreen() {
  const { theme } = useTheme();
  const { children, selectedChild, selectChild, deleteChild, getChildAge } = useChildren();

  const handleDeleteChild = (childId: string, childName: string) => {
    Alert.alert(
      'Delete Child',
      `Are you sure you want to delete ${childName}? This will also delete all their events.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteChild(childId)
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{ 
          title: 'Manage Children',
          headerStyle: { backgroundColor: theme.primary },
          headerTintColor: '#FFFFFF',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/add-child')}
              style={styles.headerButton}
              testID="add-child-header-button"
            >
              <Plus size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.content}>
        {children.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: theme.text.primary }]}>
              No Children Added
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.text.light }]}>
              Add your first child to start tracking their activities
            </Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.primary }]}
              onPress={() => router.push('/add-child')}
              testID="add-first-child-empty-button"
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add Child</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.childrenList}>
            {children.map((child) => (
              <View 
                key={child.id} 
                style={[
                  styles.childCard, 
                  { 
                    backgroundColor: theme.surface, 
                    borderColor: selectedChild?.id === child.id ? theme.primary : theme.border,
                    borderWidth: selectedChild?.id === child.id ? 2 : 1,
                  }
                ]}
              >
                <TouchableOpacity
                  style={styles.childInfo}
                  onPress={() => selectChild(child.id)}
                  testID={`select-child-${child.id}`}
                >
                  <View style={styles.childDetails}>
                    <Text style={[styles.childName, { color: theme.text.primary }]}>
                      {child.name}
                    </Text>
                    <Text style={[styles.childAge, { color: theme.text.light }]}>
                      {getChildAge(child)}
                    </Text>
                    <Text style={[styles.birthDate, { color: theme.text.light }]}>
                      Born: {child.birthDate.toLocaleDateString()}
                    </Text>
                  </View>
                  {selectedChild?.id === child.id && (
                    <Check size={24} color={theme.primary} />
                  )}
                </TouchableOpacity>
                
                <View style={styles.childActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.border }]}
                    onPress={() => router.push(`/edit-child?id=${child.id}` as any)}
                    testID={`edit-child-${child.id}`}
                  >
                    <Edit size={16} color={theme.text.primary} />
                  </TouchableOpacity>
                  
                  {children.length > 1 && (
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: '#FF6B6B' }]}
                      onPress={() => handleDeleteChild(child.id, child.name)}
                      testID={`delete-child-${child.id}`}
                    >
                      <Trash2 size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
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
  content: {
    flex: 1,
    padding: 20,
  },
  headerButton: {
    marginRight: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 40,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  childrenList: {
    gap: 16,
  },
  childCard: {
    borderRadius: 12,
    padding: 16,
  },
  childInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  childDetails: {
    flex: 1,
  },
  childName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  childAge: {
    fontSize: 14,
    marginBottom: 2,
  },
  birthDate: {
    fontSize: 12,
  },
  childActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});