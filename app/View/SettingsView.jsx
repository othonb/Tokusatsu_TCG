import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenShell } from "../Components/ScreenShell";
import { useAppSettings } from "../Context/AppSettingsContext";

const VOLUME_OPTIONS = [0, 25, 50, 75, 100];

function VolumeRow({ label, helper, value, onChange }) {
  return (
    <View style={styles.settingBlock}>
      <View style={styles.settingCopy}>
        <Text style={styles.rowTitle}>{label}</Text>
        <Text style={styles.rowSubtitle}>{helper}</Text>
      </View>

      <View style={styles.volumeRow}>
        {VOLUME_OPTIONS.map((option) => {
          const active = option === value;

          return (
            <Pressable
              key={option}
              style={[styles.volumeOption, active && styles.volumeOptionActive]}
              onPress={() => onChange(option)}
            >
              <Text style={[styles.volumeOptionText, active && styles.volumeOptionTextActive]}>{option}%</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function ToggleRow({ label, value, onToggle }) {
  return (
    <View style={styles.settingBlock}>
      <View style={styles.row}>
        <View style={styles.settingCopy}>
          <Text style={styles.rowTitle}>{label}</Text>
          <Text style={styles.rowSubtitle}>{value ? "Ativado" : "Desativado"}</Text>
        </View>

        <Pressable style={[styles.toggle, value && styles.toggleOn]} onPress={onToggle}>
          <View style={[styles.knob, value && styles.knobOn]} />
        </Pressable>
      </View>
    </View>
  );
}

export function SettingsView() {
  const {
    musicVolume,
    setMusicVolume,
    effectsVolume,
    setEffectsVolume,
    tipsEnabled,
    setTipsEnabled
  } = useAppSettings();

  return (
    <ScreenShell title="Configuração" subtitle="Preferências do jogo" showBackButton>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.panel}>
          <VolumeRow
            label="Música"
            helper="Controle o volume da trilha da partida."
            value={musicVolume}
            onChange={setMusicVolume}
          />

          <View style={styles.divider} />

          <VolumeRow
            label="Efeitos"
            helper="Controle o volume de cliques e ações da mesa."
            value={effectsVolume}
            onChange={setEffectsVolume}
          />

          <View style={styles.divider} />

          <ToggleRow label="Dicas de jogabilidade" value={tipsEnabled} onToggle={() => setTipsEnabled((current) => !current)} />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Resumo rapido</Text>
          <Text style={styles.infoText}>
            Os valores escolhidos ficam ativos nesta sessao e ja podem ser lidos por outras telas do app.
          </Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryPill}>
              <Text style={styles.summaryLabel}>Música</Text>
              <Text style={styles.summaryValue}>{musicVolume}%</Text>
            </View>

            <View style={styles.summaryPill}>
              <Text style={styles.summaryLabel}>Efeitos</Text>
              <Text style={styles.summaryValue}>{effectsVolume}%</Text>
            </View>

            <View style={styles.summaryPill}>
              <Text style={styles.summaryLabel}>Dicas</Text>
              <Text style={styles.summaryValue}>{tipsEnabled ? "On" : "Off"}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24
  },
  panel: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#f6d94f",
    backgroundColor: "rgba(6, 11, 18, 0.84)",
    overflow: "hidden"
  },
  settingBlock: {
    paddingHorizontal: 18,
    paddingVertical: 18
  },
  settingCopy: {
    flex: 1
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12
  },
  rowTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700"
  },
  rowSubtitle: {
    color: "#b8c5d3",
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18
  },
  volumeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16
  },
  volumeOption: {
    minWidth: 58,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    alignItems: "center"
  },
  volumeOptionActive: {
    backgroundColor: "#f6d94f",
    borderColor: "#f6d94f"
  },
  volumeOptionText: {
    color: "#dbe7f2",
    fontWeight: "700"
  },
  volumeOptionTextActive: {
    color: "#071018"
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)"
  },
  toggle: {
    width: 58,
    height: 32,
    borderRadius: 20,
    backgroundColor: "#374151",
    padding: 3
  },
  toggleOn: {
    backgroundColor: "#f6d94f"
  },
  knob: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#ffffff"
  },
  knobOn: {
    alignSelf: "flex-end"
  },
  infoCard: {
    marginTop: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#5cf2ff",
    backgroundColor: "rgba(4, 15, 23, 0.78)",
    padding: 18
  },
  infoTitle: {
    color: "#fff4b0",
    fontSize: 18,
    fontWeight: "800"
  },
  infoText: {
    color: "#d4dde7",
    marginTop: 8,
    lineHeight: 22
  },
  summaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16
  },
  summaryPill: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(246, 217, 79, 0.38)",
    backgroundColor: "rgba(3, 7, 16, 0.82)",
    paddingVertical: 10,
    paddingHorizontal: 14
  },
  summaryLabel: {
    color: "#c1cfdd",
    fontSize: 11,
    textTransform: "uppercase"
  },
  summaryValue: {
    color: "#fff4b0",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 4
  }
});
