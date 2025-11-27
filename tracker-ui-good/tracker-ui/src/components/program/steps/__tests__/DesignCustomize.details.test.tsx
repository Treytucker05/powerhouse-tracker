import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DesignCustomize from '../DesignCustomize';
import { BuilderStateProvider, useBuilder } from '@/context/BuilderState';

function renderWithProviders() {
    return render(
        <MemoryRouter>
            <BuilderStateProvider>
                <DesignCustomize />
            </BuilderStateProvider>
        </MemoryRouter>
    );
}

function renderWithTemplateSelected(templateId: string) {
    function SetTemplate({ children }: { children: React.ReactNode }) {
        const { setStep2 } = useBuilder();
        React.useEffect(() => { setStep2({ templateId }); }, [setStep2]);
        return <>{children}</>;
    }
    return render(
        <MemoryRouter>
            <BuilderStateProvider>
                <SetTemplate>
                    <DesignCustomize />
                </SetTemplate>
            </BuilderStateProvider>
        </MemoryRouter>
    );
}

describe('DesignCustomize details panels', () => {
    beforeEach(() => {
        try { localStorage.removeItem('ph531.builder.ui.state'); } catch { }
    });

    it('shows Supplemental details for selected option', async () => {
        renderWithProviders();
        const sup = (await screen.findAllByTestId('supplemental-details'))[0];
        expect(sup).toBeInTheDocument();
        // Default supplemental is BBB from provider defaults
        expect(within(sup).getByText(/About: Boring But Big/i)).toBeTruthy();
        expect(within(sup).getByText(/5×10 @ 30–40%/i)).toBeTruthy();

        // Switch to Widowmaker and verify
        const widowBtn = screen.getByRole('button', { name: /Widowmaker/i });
        fireEvent.click(widowBtn);
        const sup2 = (await screen.findAllByTestId('supplemental-details'))[0];
        expect(within(sup2).getByText(/About: Widowmaker/i)).toBeTruthy();
    });

    it('shows Assistance details and disables Template-driven without a template', async () => {
        renderWithProviders();
        const assist = (await screen.findAllByTestId('assistance-details'))[0];
        expect(assist).toBeInTheDocument();
        expect(within(assist).getByText(/Targets: Balanced/i)).toBeTruthy();
        expect(within(assist).getByText(/Push:/i)).toBeTruthy();

        const templateBtns = screen.getAllByRole('button', { name: /Template/i });
        expect(templateBtns[0]).toBeDisabled();
    });

    it('enables Template-driven assistance when a template is selected', async () => {
        renderWithTemplateSelected('bbb');

        const assistPickers = await screen.findAllByTestId('assistance-picker');

        // Find the picker instance that reflects the updated context (enabled Template-driven button)
        let targetPicker: HTMLElement | undefined;
        let enabledBtn: HTMLElement | undefined;
        await waitFor(() => {
            for (const p of assistPickers) {
                const btns = within(p).queryAllByTestId('assistance-mode-template');
                const candidate = btns.find((b) => !b.hasAttribute('disabled'));
                if (candidate) {
                    targetPicker = p;
                    enabledBtn = candidate;
                    break;
                }
            }
            expect(enabledBtn).toBeTruthy();
        });
        if (enabledBtn) fireEvent.click(enabledBtn);

        // Validate details within the same picker shows template-driven note
        if (targetPicker) {
            const details = await within(targetPicker).findByTestId('assistance-details');
            expect(within(details).getByText(/Follows template assistance/i)).toBeTruthy();
        }
    });

    it('shows Conditioning details for selected plan', async () => {
        renderWithProviders();
        const cond = (await screen.findAllByTestId('conditioning-details'))[0];
        expect(cond).toBeInTheDocument();
        expect(within(cond).getByText(/About: Standard/i)).toBeTruthy();
        expect(within(cond).getByText(/Hard Days/i)).toBeTruthy();
    });
});
