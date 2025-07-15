import React, { useState } from 'react';
import { useApp } from '../context';

// Import design system components
import {
    AppContainer,
    ContentContainer,
    PageHeader,
    Card,
    CardHeader,
    ProgressContainer,
    ProgressHeader,
    ProgressBar,
    TabList,
    TabTrigger,
    TabContent
} from '../components/ui/DesignSystem';

// Import the new periodization tab components
import GoalsAndNeeds from '../components/program/tabs/GoalsAndNeeds';
import MacrocycleStructure from '../components/program/tabs/MacrocycleStructure';
import PhaseDesign from '../components/program/tabs/PhaseDesign';
import MesocyclePlanning from '../components/program/tabs/MesocyclePlanning';
import MicrocycleDesign from '../components/program/tabs/MicrocycleDesign';
import SessionMonitoring from '../components/program/tabs/SessionMonitoring';
import Implementation from '../components/program/tabs/Implementation';

// Import existing program components to integrate
import { ProgramProvider } from '../contexts/ProgramContext';

const Program = () => {
    const { assessment, user } = useApp();
    const [activeTab, setActiveTab] = useState('goals');

    const tabs = [
        {
            id: 'goals',
            label: 'Goals & Needs',
            component: GoalsAndNeeds,
            description: 'Assess athlete needs and set training objectives'
        },
        {
            id: 'macrocycle',
            label: 'Macrocycle',
            component: MacrocycleStructure,
            description: 'Outline annual training timeline and structure'
        },
        {
            id: 'phases',
            label: 'Phases',
            component: PhaseDesign,
            description: 'Design preparatory, competitive, and transition phases'
        },
        {
            id: 'mesocycles',
            label: 'Mesocycles',
            component: MesocyclePlanning,
            description: 'Plan 2-6 week training blocks with specific focus'
        },
        {
            id: 'microcycles',
            label: 'Microcycles',
            component: MicrocycleDesign,
            description: 'Design weekly training patterns and loading'
        },
        {
            id: 'sessions',
            label: 'Sessions & Monitoring',
            component: SessionMonitoring,
            description: 'Detail daily sessions and monitoring protocols'
        },
        {
            id: 'implementation',
            label: 'Implementation',
            component: Implementation,
            description: 'Execute, track, and refine the program'
        }
    ];

    const getCurrentTabIndex = () => {
        return tabs.findIndex(tab => tab.id === activeTab);
    };

    const handleNext = () => {
        const currentIndex = getCurrentTabIndex();
        if (currentIndex < tabs.length - 1) {
            setActiveTab(tabs[currentIndex + 1].id);
        }
    };

    const handlePrevious = () => {
        const currentIndex = getCurrentTabIndex();
        if (currentIndex > 0) {
            setActiveTab(tabs[currentIndex - 1].id);
        }
    };

    const progressPercentage = ((getCurrentTabIndex() + 1) / tabs.length) * 100;

    return (
        <ProgramProvider>
            <AppContainer>
                <ContentContainer>
                    {/* Header */}
                    <PageHeader
                        title="Program Design"
                        description="Design comprehensive training programs using evidence-based periodization principles"
                    >
                        {/* Progress Indicator */}
                        <ProgressContainer>
                            <ProgressHeader
                                label="Progress"
                                value={`Step ${getCurrentTabIndex() + 1} of ${tabs.length}`}
                            />
                            <ProgressBar value={progressPercentage} />
                        </ProgressContainer>
                    </PageHeader>

                    {/* Tab Navigation */}
                    <TabList>
                        {tabs.map((tab, index) => (
                            <TabTrigger
                                key={tab.id}
                                active={activeTab === tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                title={tab.description}
                            >
                                <div className="text-center">
                                    <span className="text-xs font-medium">{index + 1}</span>
                                    <br />
                                    <span className="text-xs">{tab.label}</span>
                                </div>
                            </TabTrigger>
                        ))}
                    </TabList>

                    {/* Tab Content */}
                    {tabs.map((tab) => {
                        if (activeTab !== tab.id) return null;

                        const Component = tab.component;

                        return (
                            <TabContent key={tab.id}>
                                <CardHeader
                                    title={tab.label}
                                    description={tab.description}
                                />

                                <Component
                                    assessmentData={assessment}
                                    user={user}
                                    onNext={handleNext}
                                    onPrevious={handlePrevious}
                                    canGoNext={getCurrentTabIndex() < tabs.length - 1}
                                    canGoPrevious={getCurrentTabIndex() > 0}
                                />
                            </TabContent>
                        );
                    })}
                </ContentContainer>
            </AppContainer>
        </ProgramProvider>
    );
};

export default Program;
