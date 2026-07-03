import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go

# =====================================================================
# 1. KONFIGURASI LAYOUT GRAFIK
# =====================================================================
def apply_standard_layout(fig, title, show_grid=True):
    fig.update_layout(
        title=dict(text=title, font=dict(size=18, color="#2C3E50")),
        plot_bgcolor="white",
        paper_bgcolor="white",
        font=dict(family="Arial, sans-serif", color="#34495E"),
        xaxis=dict(showgrid=show_grid, gridcolor="#E5E8E8", zeroline=False, showline=True, linecolor='#BDC3C7', linewidth=1),
        yaxis=dict(showgrid=show_grid, gridcolor="#E5E8E8", zeroline=False, showline=True, linecolor='#BDC3C7', linewidth=1),
        margin=dict(t=60, b=40, l=40, r=40),
        hovermode="closest"
    )
    return fig

# =====================================================================
# 2. PEMBUATAN VISUALISASI (1 HINGGA 5)
# =====================================================================

def create_fig1_reaction_sunburst():
    """
    VISUALISASI 1 (DIUPGRADE): Sunburst Chart untuk Klasifikasi Reaksi Inti.
    Sangat interaktif untuk menunjukkan hierarki skala waktu dan jenis reaksi.
    """
    labels = [
        "Reaksi Inti", 
        "Hamburan<br>(~10<sup>-22</sup> s)", "Reaksi Langsung<br>(~10<sup>-21</sup> s)", "Inti Majemuk<br>(~10<sup>-19</sup> s)",
        "Elastis (Q=0)", "Inelastis (Q≠0)", 
        "Stripping", "Pick-up", 
        "Fusi/Fisi", "Evaporasi"
    ]
    parents = [
        "", 
        "Reaksi Inti", "Reaksi Inti", "Reaksi Inti",
        "Hamburan<br>(~10<sup>-22</sup> s)", "Hamburan<br>(~10<sup>-22</sup> s)", 
        "Reaksi Langsung<br>(~10<sup>-21</sup> s)", "Reaksi Langsung<br>(~10<sup>-21</sup> s)", 
        "Inti Majemuk<br>(~10<sup>-19</sup> s)", "Inti Majemuk<br>(~10<sup>-19</sup> s)"
    ]
    values = [100, 30, 30, 40, 15, 15, 15, 15, 20, 20]
    
    fig = go.Figure(go.Sunburst(
        labels=labels, parents=parents, values=values, branchvalues="total",
        marker=dict(colors=px.colors.qualitative.Pastel),
        hovertemplate='<b>%{label}</b><br>Proporsi: %{percentParent:.1%}<extra></extra>'
    ))
    fig.update_layout(title=dict(text="<b>Klasifikasi Hirarki Reaksi Inti</b><br><sup>Klik segmen untuk Zoom-In</sup>"), margin=dict(t=60, l=10, r=10, b=10))
    return fig

def create_fig2_q_value():
    """VISUALISASI 2: Energetika (Q-Value & Threshold Energy)"""
    x = np.linspace(0, 10, 100)
    y_exo = x + 5  # Eksotermik (Q > 0)
    y_endo = x - 5 # Endotermik (Q < 0)
    
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=x, y=y_exo, mode='lines', name='Reaksi Eksotermik (Q > 0)', line=dict(color='#27AE60', width=3)))
    fig.add_trace(go.Scatter(x=x, y=y_endo, mode='lines', name='Reaksi Endotermik (Q < 0)', line=dict(color='#E74C3C', width=3)))
    
    # Threshold Annotation
    fig.add_vline(x=5, line_width=2, line_dash="dash", line_color="#7F8C8D")
    fig.add_annotation(x=5, y=-2, text="Energi Ambang (E<sub>th</sub>)", showarrow=True, arrowhead=1)
    
    fig = apply_standard_layout(fig, "<b>Energetika Reaksi: Kurva Nilai-Q</b>")
    fig.update_layout(xaxis_title="Energi Kinetik Proyektil Datang (MeV)", yaxis_title="Energi Kinetik Produk (MeV)")
    return fig

def create_fig3_isospin():
    """VISUALISASI 3: Multiplet Isospin (IAS)"""
    df = pd.DataFrame({"Isotop": ["14C", "14N*", "14O"], "Tz": [1, 0, -1], "Eksitasi": [0, 2.31, 0], "Warna": ["#16A085", "#8E44AD", "#F39C12"]})
    fig = px.scatter(df, x="Tz", y="Eksitasi", text="Isotop", size_max=20)
    fig.update_traces(marker=dict(size=18, color=df["Warna"], symbol="diamond", line=dict(width=2, color="black")), textposition='top center', textfont_size=15)
    fig = apply_standard_layout(fig, "<b>Multiplet Analog Isobarik (Triad A=14)</b>")
    fig.update_layout(xaxis=dict(range=[-2, 2], dtick=1), yaxis=dict(range=[-1, 4]), xaxis_title="Proyeksi Isospin (T<sub>z</sub>)", yaxis_title="Energi Eksitasi Relatif (MeV)")
    return fig

def create_fig4_cross_section():
    """VISUALISASI 4: Penampang Lintang (Breit-Wigner)"""
    E = np.linspace(20, 80, 400)
    sigma = 150 / ((E - 50)**2 + (4 / 2)**2) # Breit-Wigner
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=E, y=sigma, fill='tozeroy', mode='lines', line=dict(color='#D35400', width=3), fillcolor='rgba(211, 84, 0, 0.2)'))
    fig = apply_standard_layout(fig, "<b>Penampang Lintang Reaksi (Resonansi)</b>")
    fig.add_annotation(x=50, y=max(sigma), text="Puncak Resonansi Inti Majemuk", showarrow=True, arrowhead=2, ay=-40)
    fig.update_layout(xaxis_title="Energi Proyektil, E (MeV)", yaxis_title="Penampang Lintang, σ (barns)", showlegend=False)
    return fig

def create_fig5_hpge_spectrum():
    """
    VISUALISASI 5 (DIUPGRADE): Spektrum HPGe Realistis (Cobalt-60).
    Menampilkan Noise, Compton Continuum, Compton Edge, dan Photopeaks beresolusi tinggi.
    """
    x = np.linspace(200, 1500, 1000)
    # Background eksponensial
    y = 500 * np.exp(-x / 500) 
    # Compton continuum (menggunakan arctan sebagai step function)
    y += 120 * (1 - 1/(1 + np.exp(-(x - 963)/10)))  # Compton Co-60 1
    y += 90 * (1 - 1/(1 + np.exp(-(x - 1118)/10))) # Compton Co-60 2
    # Photopeaks Gaussian
    y += 800 * np.exp(-((x - 1173.2) ** 2) / (2 * 4**2))
    y += 700 * np.exp(-((x - 1332.5) ** 2) / (2 * 4**2))
    # Add random statistical noise
    np.random.seed(42)
    y += np.random.normal(0, 8, len(x))
    y = np.maximum(y, 1) # Mencegah log(0)
    
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=x, y=y, mode='lines', line=dict(color='#2980B9', width=1.5), name="Spektrum"))
    
    # Anotasi Edukatif
    fig.add_annotation(x=1173, y=850, text="<b>Fotopuncak 1.17 MeV</b>", showarrow=True, arrowhead=2, arrowcolor="#2C3E50", ay=-30)
    fig.add_annotation(x=1332, y=750, text="<b>Fotopuncak 1.33 MeV</b>", showarrow=True, arrowhead=2, arrowcolor="#2C3E50", ay=-30)
    fig.add_annotation(x=963, y=250, text="Compton Edge", showarrow=True, arrowhead=2, ay=-40)
    
    fig = apply_standard_layout(fig, "<b>Spektrum Radiasi Sinar Gamma (Detektor HPGe)</b>")
    fig.update_layout(xaxis_title="Energi Foton (keV)", yaxis_title="Cacahan per Saluran (Counts)", yaxis_type="log", showlegend=False)
    return fig

# =====================================================================
# 3. GENERATOR HTML TERINTEGRASI MATHJAX
# =====================================================================

def generate_html_module(figs, output_path):
    html_divs = [fig.to_html(full_html=False, include_plotlyjs='cdn') for fig in figs]
    
    html_content = f"""
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <title>Modul Fisika Nuklir: Reaksi Inti</title>
        <script>
          MathJax = {{
            tex: {{ inlineMath: [['$', '$'], ['\\\\(', '\\\\)']], displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']] }}
          }};
        </script>
        <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script>
        <style>
            body {{ font-family: 'Segoe UI', Arial, sans-serif; background-color: #EDF2F4; color: #2C3E50; line-height: 1.8; padding: 20px 0; }}
            .container {{ max-width: 1000px; margin: auto; background: white; padding: 40px 60px; border-radius: 12px; box-shadow: 0 10px 20px rgba(0,0,0,0.05); }}
            h1 {{ text-align: center; color: #2C3E50; font-size: 2.5em; border-bottom: 3px solid #3498DB; padding-bottom: 15px; }}
            h2 {{ color: #2980B9; margin-top: 50px; border-left: 5px solid #2980B9; padding-left: 15px; background: #F4F6F7; padding: 10px 15px; border-radius: 0 8px 8px 0;}}
            h3 {{ color: #E74C3C; margin-top: 30px; }}
            p {{ text-align: justify; font-size: 1.05em; }}
            .chart-wrapper {{ margin: 40px 0; border: 1px solid #E5E8E8; border-radius: 8px; padding: 10px; background: #FAFAFA; }}
            ul {{ font-size: 1.05em; }}
            li {{ margin-bottom: 8px; }}
            .formula-box {{ background: #FDFEFE; border: 1px dashed #D5D8DC; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0; overflow-x: auto; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Modul Interaktif: Fisika Nuklir (Reaksi Inti)</h1>
            <p>Materi ini telah disusun secara komprehensif, padat, dan terstruktur agar Anda dapat memahaminya dengan mudah, dilengkapi dengan representasi visual <i>Data Storytelling</i>.</p>

            <h2>BAB 1: Types of Reactions and Conservation Laws</h2>
            <h3>1. Definisi dan Notasi Reaksi Biner</h3>
            <p>Reaksi inti terjadi ketika suatu partikel proyektil ($a$) menumbuk inti target ($X$), menghasilkan inti sisa/residu ($Y$) dan partikel yang terpancar ($b$). Notasi standarnya ditulis sebagai:</p>
            <div class="formula-box">$$X + a \\rightarrow Y + b \\quad \\text{{atau}} \\quad X(a,b)Y$$</div>
            
            <h3>2. Klasifikasi Reaksi Inti</h3>
            <p>Berdasarkan mekanisme interaksinya, reaksi nuklir dikelompokkan menjadi beberapa fase skala waktu dan skenario benturan. Silakan eksplorasi hierarki mekanismenya pada grafik di bawah ini dengan melakukan <i>klik</i> pada setiap segmen:</p>
            <div class="chart-wrapper">{html_divs[0]}</div>
            <ul>
                <li><b>Hamburan Elastis (Elastic Scattering):</b> Partikel proyektil dan target tidak berubah identitasnya, dan total energi kinetik sistem bernilai kekal ($Q=0$). Contoh: $X(a,a)X$.</li>
                <li><b>Hamburan Inelastis (Inelastic Scattering):</b> Sebagian energi kinetik proyektil diserap untuk mengeksitasi (menaikkan tingkat energi) inti target. Contoh: $X(a,a')X^*$.</li>
                <li><b>Reaksi Langsung (Direct Reactions):</b> Proyektil hanya berinteraksi dengan nukleon-nukleon di bagian permukaan target dalam waktu yang sangat singkat ($\\approx 10^{{-22}}$ s). Meliputi reaksi stripping dan pick-up.</li>
                <li><b>Reaksi Inti Majemuk (Compound Nucleus):</b> Proyektil dan target melebur sepenuhnya membentuk inti majemuk antara yang berumur lebih panjang ($\\approx 10^{{-19}}$ s). Inti majemuk ini akan kehilangan "ingatan" tentang proses pembentukannya sebelum akhirnya meluruh (Hipotesis Bohr).</li>
            </ul>

            <h3>3. Hukum Kekekalan</h3>
            <p>Agar suatu reaksi nuklir dapat terjadi, ia harus secara ketat mematuhi hukum kekekalan universal: Kekekalan Energi Total, Kekekalan Momentum Linier dan Sudut, Kekekalan Muatan Listrik ($Z$) dan Nomor Massa ($A$), serta Kekekalan Paritas ($\\pi$).</p>

            <h2>BAB 2: Energetics of Nuclear Reactions</h2>
            <h3>1. Persamaan Nilai-Q (Q-Value)</h3>
            <p>Nilai-$Q$ mendefinisikan selisih energi massa diam antara reaktan dan produk. Nilai ini menentukan apakah reaksi tersebut akan melepaskan atau justru membutuhkan energi fisis.</p>
            <div class="formula-box">$$Q = (m_X + m_a - m_Y - m_b) c^2 \\quad \\text{{atau}} \\quad Q = T_Y + T_b - T_a$$</div>
            <p>Jika $Q > 0$ (Reaksi Eksotermik), reaksi melepaskan energi. Jika $Q < 0$ (Reaksi Endotermik), reaksi menyerap energi dari kinetik proyektil.</p>
            
            <h3>2. Energi Ambang (Threshold Energy) & Barier Coulomb</h3>
            <p>Pada reaksi endotermik ($Q < 0$), reaksi sama sekali tidak akan terjadi kecuali partikel memiliki energi kinetik yang melampaui suatu batas minimum, yang disebut Energi Ambang ($E_{{th}}$):</p>
            <div class="formula-box">$$E_{{th}} = |Q| \\left(1 + \\frac{{m_a}}{{m_X}} \\right)$$</div>
            <div class="chart-wrapper">{html_divs[1]}</div>

            <h2>BAB 3: Isospin</h2>
            <h3>1. Konsep Isospin (Isotopic Spin)</h3>
            <p>Karena proton dan neutron memiliki massa yang hampir identik dan bereaksi sama kuat di bawah gaya nuklir kuat, keduanya dianggap sebagai partikel dasar yang sama, yakni <b>Nukleon</b>. Setiap Nukleon ditetapkan memiliki isospin $T = 1/2$. Proyeksinya adalah $T_z = +1/2$ (neutron) dan $T_z = -1/2$ (proton). Total proyeksi inti: $T_z = \\frac{{N - Z}}{{2}}$.</p>
            
            <h3>2. Keadaan Analog Isobarik (Isobaric Analog States / IAS)</h3>
            <p>Pada inti cermin (nomor massa $A$ sama, namun saling bertukar susunan proton-neutronnya), tingkat energinya akan sejajar secara matematis setelah koreksi penolakan energi Coulomb dilakukan. Ini bukti mutlak bahwa Gaya Nuklir mematuhi Simetri Isospin.</p>
            <div class="chart-wrapper">{html_divs[2]}</div>

            <h2>BAB 4: Reaction Cross Sections</h2>
            <h3>1. Definisi Geometris & Teori Resonansi Breit-Wigner</h3>
            <p>Penampang lintang ($\\sigma$) bukanlah ukuran fisik sebenarnya, melainkan probabilitas terjadinya suatu reaksi jika ditembak proyektil (satuannya <i>barn</i> = $10^{{-28}} \\text{{ m}}^2$).</p>
            <p>Terkadang, penampang lintang melonjak naik drastis bagai sebuah "paku" ketika energi datang proyektil selaras dengan eksitasi inti majemuk. Kurva serapan ini dipetakan dengan distribusi Breit-Wigner:</p>
            <div class="formula-box">$$\\sigma(E) = \\pi \\lambda^2 \\frac{{\\Gamma_a \\Gamma_b}}{{(E - E_r)^2 + (\\Gamma/2)^2}}$$</div>
            <div class="chart-wrapper">{html_divs[3]}</div>

            <h2>BAB 5: Experimental Techniques</h2>
            <h3>1. Sistem Instrumen Detektor Spektroskopi</h3>
            <p>Fisikawan menggunakan instrumen detektor yang mumpuni untuk merekam pancaran radiasi hasil reaksi. Ada dua jenis utama: <b>Detektor Sintilasi</b> (menggunakan bahan berpendur seperti NaI) dan <b>Detektor Semikonduktor</b>.</p>
            <p>Perhatikan grafik di bawah ini yang mensimulasikan hasil bacaan dari detektor <i>High-Purity Germanium</i> (HPGe). Detektor ini memiliki resolusi super tinggi, yang mampu menangkap jejak <i>Compton Edge</i> serta membedakan paku fotopuncak diskrit energi gamma dengan sangat tajam (contoh: karakteristik peluruhan Cobalt-60 pada 1173 dan 1332 keV).</p>
            <div class="chart-wrapper">{html_divs[4]}</div>

            <h3>2. Analisis Kinematika Eksperimen Umum</h3>
            <p>Metode <b>Time-of-Flight (TOF) & Spektograf Magnetik</b> digunakan untuk melewatkan partikel ke dalam vakum bermedan magnet kuat. Dengan mengukur radius belokan ($B\\rho = p/q$), fisikawan dapat mendeduksi momentum dan massanya dengan presisi tinggi.</p>
        </div>
    </body>
    </html>
    """
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"Modul HTML Interaktif selesai dibuat: {output_path}")

# =====================================================================
# 4. EKSEKUSI UTAMA
# =====================================================================
if __name__ == "__main__":
    # Generate semua figure
    figs = [
        create_fig1_reaction_sunburst(),
        create_fig2_q_value(),
        create_fig3_isospin(),
        create_fig4_cross_section(),
        create_fig5_hpge_spectrum()
    ]
    # Injeksi ke HTML dengan MathJax
    generate_html_module(figs, 'Modul_E_Learning_Nuklir.html')