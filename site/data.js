// =============================================================
//  DỮ LIỆU GHI CHÚ – chỉ cần sửa file này
// =============================================================
//  Viết thao tác trong rotation bằng ký hiệu:
//    "E"  "E giữ"  "Q"  "BA"  "BA x2"  "CA"  "CA giữ"  "Nhảy"  "Lướt"
//  Thêm " x2", " x3"... để ghi số lần.
//  Ảnh: dán URL vào icon. Bỏ trống thì hiện chữ cái đầu tên.
//  element: pyro / hydro / electro / cryo / anemo / geo / dendro
//  weapon:  sword / claymore / polearm / bow / catalyst
// =============================================================

const ACTIONS = {
  "E":      { label: "Kỹ năng nguyên tố",            type: "skill" },
  "E giữ":  { label: "Giữ kỹ năng nguyên tố",        type: "skill" },
  "Q":      { label: "Kỹ năng nộ",                   type: "burst" },
  "BA":     { label: "Đánh thường (Basic Attack)",   type: "basic" },
  "CA":     { label: "Trọng kích (Charged Attack)",  type: "charged" },
  "CA giữ": { label: "Giữ trọng kích liên tục",      type: "charged" },
  "Nhảy":   { label: "Nhảy",                         type: "move" },
  "Lướt":   { label: "Lướt / né",                    type: "move" },
};

// Ảnh lấy từ genshin-impact.fandom.com (Character/List)
const IMG = "https://static.wikia.nocookie.net/gensin-impact/images/";

const ELEMENTS = {
  pyro:    { name: "Hỏa",   icon: IMG + "e/e8/Element_Pyro.png/revision/latest" },
  hydro:   { name: "Thủy",  icon: IMG + "3/35/Element_Hydro.png/revision/latest" },
  electro: { name: "Lôi",   icon: IMG + "7/73/Element_Electro.png/revision/latest" },
  cryo:    { name: "Băng",  icon: IMG + "8/88/Element_Cryo.png/revision/latest" },
  anemo:   { name: "Phong", icon: IMG + "a/a4/Element_Anemo.png/revision/latest" },
  geo:     { name: "Nham",  icon: IMG + "4/4a/Element_Geo.png/revision/latest" },
  dendro:  { name: "Thảo",  icon: IMG + "f/f4/Element_Dendro.png/revision/latest" },
};

const WEAPONS = {
  sword:    { name: "Kiếm đơn", icon: IMG + "9/95/Weapon-class-sword-icon.png/revision/latest" },
  claymore: { name: "Đại kiếm", icon: IMG + "5/51/Weapon-class-claymore-icon.png/revision/latest" },
  polearm:  { name: "Vũ khí cán dài", icon: IMG + "9/91/Weapon-class-polearm-icon.png/revision/latest" },
  bow:      { name: "Cung",     icon: IMG + "9/97/Weapon-class-bow-icon.png/revision/latest" },
  catalyst: { name: "Pháp khí", icon: IMG + "0/02/Weapon-class-catalyst-icon.png/revision/latest" },
};

// Thuật ngữ: chữ nào trùng key sẽ được gạch chân chấm, rê chuột / chạm vào để xem giải thích.
const GLOSSARY = {
  "Tinh-Siêu Dẫn": "Phản ứng Băng + Lôi đặc biệt, thay cho Siêu Dẫn khi trong đội có nhân vật như Sandrone. Mỗi lần kích hoạt sẽ tạo Pha Lê Tinh Huy và một Vùng Trục Sao quanh đó trong 7s.",
  "Vùng Trục Sao": "Vùng tạo ra từ Tinh-Siêu Dẫn. Nhân vật đứng trong vùng được tăng ST Băng và ST Lôi, quái trong vùng bị giảm 40% Kháng Vật Lý. Đánh Băng/Lôi trúng quái trong vùng càng nhiều thì buff mỗi 4s càng mạnh.",
  "Tinh Tú Lấp Lánh": "Tên gọi chung cho nhóm phản ứng Băng đặc biệt chỉ xuất hiện khi trong đội có nhân vật như Sandrone, gồm Tinh-Siêu Dẫn (Băng + Lôi) và Tinh-Khuếch Tán (Băng + Phong). Món nào tăng ST Tinh Tú Lấp Lánh thì tăng luôn cả hai phản ứng này.",
  "Tinh-Khuếch Tán": "Phản ứng Phong khuếch tán Băng đặc biệt, thay cho Khuếch Tán Băng khi trong đội có nhân vật như Sandrone. Gây ST Phong rồi để lại một xoáy nổ ra ST Băng sau một lúc; kích hoạt liên tiếp gần xoáy thì xoáy mạnh và rộng hơn.",
  "2U":"U (Unit) là độ dày của ấn nguyên tố gắn trên quái. 1U là ấn mỏng, 2U là ấn dày: trụ lâu hơn và chịu được nhiều lần phản ứng hơn. Nhờ vậy ấn 2U vừa đủ xóa ấn nguyên tố cũ, vừa còn dư để phủ ấn mới lên quái.",
};

const CHARACTERS = [
  {
    id: "mavuika",
    name: "Mavuika",
    title: "Hỏa Thần",
    rarity: 5,
    element: "pyro",
    weapon: "claymore",
    role: "Main DPS",
    region: "Natlan",
    icon: IMG + "d/da/Mavuika_Icon.png/revision/latest",

    summary:
      "Main DPS Hỏa. Kỹ năng nộ không dùng năng lượng mà dùng Chiến Ý, tích từ việc đồng đội tiêu hao Dạ Hồn hoặc Tấn Công Thường trúng địch – nên vẫn sạc được Nộ khi đi với team ngoài Natlan.",

    // Tên + icon kỹ năng: genshin-impact.fandom.com/vi/wiki/Mavuika
    skills: [
      {
        key: "BA",
        name: "Lửa Đỏ Dệt Sinh Mệnh",
        icon: IMG + "5/57/Claymore_Pyro.png/revision/latest",
        desc: "Tấn Công Thường tối đa 4 lần chém. Trọng Kích tiêu hao thể lực để chém lửa về phía trước. Khi lái Mô Tô Vượt Lửa, mọi đòn đánh đều thành Sát Thương Hỏa.",
      },
      {
        key: "E",
        name: "Thời Khắc Lưu Danh",
        icon: IMG + "b/b1/Talent_The_Named_Moment.png/revision/latest",
        desc: "Hồi đầy Dạ Hồn, vào Dạ Hồn Chúc Phúc. Nhấn: gọi Vòng Hào Quang đi theo đội, đánh Hỏa theo chu kỳ (gắn ấn Hỏa khi Mavuika ở ngoài sân). Nhấn giữ: lái Mô Tô Vượt Lửa, đánh Hỏa trên sân.",
      },
      {
        key: "Q",
        name: "Biển Lửa Rợp Trời",
        icon: IMG + "5/5d/Talent_Hour_of_Burning_Skies.png/revision/latest",
        desc: "Dùng được khi có từ 50% Chiến Ý, tiêu hết Chiến Ý. Nhận 10 điểm Dạ Hồn, lái mô tô tung Trụy Nhật Trảm rồi vào trạng thái Lò Lửa Sinh Tử: không tốn Dạ Hồn, tăng kháng gián đoạn, đòn đánh mạnh hơn theo lượng Chiến Ý đã dùng. Rời sân là mất trạng thái.",
      },
    ],

    teams: [
      {
        name: "Tan Chảy (Melt)",
        members: ["mavuika", "xilonen", "bennett", "citlali"],
        video: { title: "Mavuika combo guide from basic to advanced – NDC Impact", url: "" },
        rotation: [
          { char: "mavuika", actions: ["E"],
            why: "Tiêu hao Dạ Hồn, kích hoạt ấn Hỏa từ off-field." },
          { char: "xilonen", actions: ["E", "BA x2"],
            why: "Giảm kháng nguyên tố của quái và kích buff thánh di vật. Có thể dùng Q nếu cần hồi máu." },
          { char: "bennett", actions: ["Q"],
            why: "Tạo vùng hồi máu và buff tấn công lớn. Có thể dùng E trước Q." },
          { char: "citlali", actions: ["E", "Q"],
            why: "E tạo khiên. Q có ấn Băng mạnh (2U), xóa ấn Hỏa của Bennett và liên tục gắn lại ấn Băng lên quái.",
            warn: "Nhớ bấm Q ngay sau E, hoặc đảo lại: Q trước rồi mới E. Nếu để Citlali đứng sân lâu quá, Vòng Hào Quang của Mavuika sẽ kịp gắn Hỏa lên quái trước, và Q của Citlali không còn phủ được ấn Băng nữa." },
          { char: "mavuika", actions: ["Q", "BA"],
            why: "Vừa đổi ra là bấm Q ngay, sau đó đánh thường 1 cái (hoặc lướt xe) để bộ 4 món Bí Điển Obsidian kích hoạt, cộng thêm 40% tỷ lệ bạo kích.",
            warn: "Đừng chậm tay ở bước này, vì Vòng Hào Quang từ bước 1 có thể nổ trúng quái và lấy mất ấn Băng. Cũng đừng giữ trọng kích ngay sau Q, vì vài đòn đầu có thể chưa được cộng 40% bạo kích." },
          { char: "mavuika", actions: ["CA giữ"],
            why: "Giữ trọng kích xoay cho đến khi hết Lò Lửa Sinh Tử." },
        ],
      },
    ],

    build: {
      stats: [
        { label: "Tỷ lệ bạo kích", target: "~60%",
          note: "Bộ 4 Bí Điển Obsidian cho thêm 40%, đạt 100%." },
        { label: "Hiệu quả nạp", target: "Không cần", bad: true,
          note: "Q dùng Chiến Ý, không dùng năng lượng. Đừng chọn dòng phụ hay vũ khí tăng nạp." },
      ],
      artifacts: [
        { set: "Bí Điển Obsidian", pieces: 4,
          icon: IMG + "8/86/Item_Reckoning_of_the_Xenogenic.png/revision/latest",
          note: "2 món: +15% sát thương khi ở Dạ Hồn Chúc Phúc.\n4 món: tiêu hao 1 điểm Dạ Hồn → +40% tỷ lệ bạo kích trong 6s." },
      ],
      mainStats: [
        { slot: "Đồng hồ", stat: "% Tấn Công", note: "Hoặc Tinh Thông Nguyên Tố nếu chơi thuần Tan Chảy." },
        { slot: "Ly",      stat: "Tăng ST Hỏa", note: "Hoặc % Tấn Công." },
        { slot: "Nón",     stat: "ST Bạo Kích", note: "Tỷ lệ bạo kích đã có bộ Obsidian lo." },
      ],
      // Thứ tự ưu tiên từ trên xuống
      weapons: [
        { tier: "Trấn", name: "Thiên Dương Rực Lửa",
          icon: IMG + "2/2c/Weapon_A_Thousand_Blazing_Suns.png/revision/latest" },
        { tier: "5★ thay thế", name: "Hải Đăng Bờ Biển Lau",
          icon: IMG + "6/6c/Weapon_Beacon_of_the_Reed_Sea.png/revision/latest" },
        { tier: "5★ thay thế", name: "Xích Giác Phá Thạch Đao",
          icon: IMG + "d/d4/Weapon_Redhorn_Stonethresher.png/revision/latest",
          note: "Chọn khi thiếu ST bạo kích." },
        { tier: "4★", name: "Kiếm Li Cốt",
          icon: IMG + "8/88/Weapon_Serpent_Spine.png/revision/latest",
          note: "R5 rất mạnh." },
        { tier: "4★", name: "Bóng Tối Thủy Triều",
          icon: IMG + "6/69/Weapon_Tidal_Shadow.png/revision/latest",
          note: "Vũ khí rèn Natlan, tăng nhiều % Tấn Công." },
      ],
    },

    notes: [],
  },

  {
    id: "sandrone",
    name: "Sandrone",
    title: "Quan Chấp Hành Fatui",
    rarity: 5,
    element: "cryo",
    weapon: "claymore",
    role: "Main DPS",
    region: "Snezhnaya",
    icon: IMG + "c/c8/Sandrone_Icon.png/revision/latest",

    summary:
      "Main DPS Băng. Khi có Sandrone trong đội, Siêu Dẫn chuyển thành Tinh-Siêu Dẫn và tạo ra Vùng Trục Sao: cả đội được tăng ST Băng, ST Lôi, còn quái bị giảm Kháng Vật Lý. Đứng trong vùng này, Sandrone vào trạng thái Tỏa Sáng: Tinh-Siêu Dẫn và đòn đánh mạnh hơn hẳn.",

    // Tên + icon kỹ năng: genshin-impact.fandom.com/vi/wiki/Sandrone
    skills: [
      {
        key: "BA",
        name: "Công Thức Hiện Tượng - Mệnh Đề Hiển Nhiên",
        icon: IMG + "9/99/Claymore_Cryo.png/revision/latest",
        desc: "Tấn Công Thường tối đa 3 đòn bằng sợi chỉ điều khiển vũ khí. Trọng Kích gọi cỗ máy Fagio vào chế độ Giải Mã, bắn phá phía trước và phóng Tia Ngưng Tụ theo chu kỳ, gây ST Băng (tính là ST Tinh-Siêu Dẫn khi đang Tỏa Sáng).\nCông Suất Giải Mã của Fagio tăng dần, chạm 100 thì Fagio Quá Tải: bắn chậm hơn và không vào lại Giải Mã được cho tới khi công suất tụt dưới 50.",
      },
      {
        key: "E",
        name: "Công Thức Hiện Tượng - Phân Tích Vi Sai",
        icon: IMG + "e/e0/Talent_Formule_Phenomenale_Differential_Analysis.png/revision/latest",
        desc: "Ngồi lên Thiết Bị Đột Kích Chiến Thuật Tiệc Trà, lướt về phía trước trong 6s. Nếu có quái gần đó, bắn 2 viên Đạn Lăng Kính gây ST Băng (viên thứ hai tính là ST Tinh-Siêu Dẫn khi đang Tỏa Sáng). Trong lúc lướt, Sandrone sửa Fagio nên Công Suất Giải Mã giảm rất nhanh.",
      },
      {
        key: "Q",
        name: "Công Thức Hiện Tượng - Chứng Minh Mọi Nguyên Lý",
        icon: IMG + "0/06/Talent_Formule_Phenomenale_Q.E.D..png/revision/latest",
        desc: "Gọi hàng loạt Pháo Cộng Hưởng Lăng Kính oanh tạc một vùng rộng, rồi phóng Chùm Tia Tụ Năng Nhiệt Độ Âm gây ST Băng diện rộng (tính là ST Tinh-Siêu Dẫn khi đang Tỏa Sáng).",
      },
    ],

    teams: [
      {
        name: "Tinh-Siêu Dẫn",
        members: ["sandrone", "alyosha", "diona", "sucrose"],
        rotation: [
          { char: "diona", actions: ["E giữ", "Q"],
            why: "Giữ E để tạo khiên chắc, rồi bật Q để có vùng hồi máu và gắn ấn Băng lên quái." },
          { char: "sucrose", actions: ["E", "Q"],
            why: "Khuếch tán Băng để gom quái lại gần. Nếu Sucrose mang 4 món Bóng Hình Màu Xanh, quái còn bị giảm Kháng Băng." },
          { char: "alyosha", actions: ["E", "Q"],
            why: "Alyosha gắn Lôi từ ngoài sân. Lôi gặp ấn Băng có sẵn trên quái sẽ kích hoạt Tinh-Siêu Dẫn và mở ra Vùng Trục Sao." },
          { char: "sandrone", actions: ["CA giữ"],
            why: "Giữ trọng kích để Fagio vào chế độ Giải Mã, liên tục phóng Tia Ngưng Tụ và ăn trọn buff của Vùng Trục Sao." },
          { char: "sandrone", actions: ["E"],
            why: "Khi Công Suất Giải Mã đã lên cao (trên 50, tốt nhất là gần mốc 100), bấm E để hạ công suất xuống. Nhờ nội tại, viên Đạn Lăng Kính thứ hai sẽ gây 400% sát thương, và cứ mỗi 10 điểm công suất giảm, Sandrone nhận 1 tầng Chiến Thuật Cải Tiến.",
            warn: "Đừng để Fagio chạm 100 rồi mới xử lý. Lúc đó Fagio Quá Tải, bắn chậm hẳn và không vào lại Giải Mã được cho tới khi công suất tụt dưới 50." },
          { char: "sandrone", actions: ["CA giữ", "Q"],
            why: "Giữ trọng kích thêm một vòng nữa, rồi kết thúc bằng Q khi vẫn còn đứng trong Vùng Trục Sao. Q lúc này dùng hết số tầng Chiến Thuật Cải Tiến, mỗi tầng cộng thêm 10% sát thương cho chùm tia cuối." },
        ],
      },
    ],

    build: {
      stats: [
        { label: "Bạo kích", target: "70% / 140%+",
          note: "Tỷ lệ bạo kích / ST bạo kích. Sandrone cần bạo kích đều cho cả chuỗi tia của Fagio lẫn chiêu Q." },
        { label: "Hiệu quả nạp", target: "~120–130%",
          note: "Q chiếm phần lớn sát thương. Diona và Alyosha sẽ sạc năng lượng hộ." },
      ],
      artifacts: [
        { set: "Ảo Tưởng Vụn Vỡ Trong Bóng Tối", pieces: 4,
          icon: IMG + "5/5c/Item_Iridescence_That_Ceased_Amidst_Glory.png/revision/latest",
          note: "2 món: +18% Tấn Công.\n4 món: ST Siêu Dẫn +80%, ST Tinh-Siêu Dẫn +40%. Đánh quái đang dính Siêu Dẫn hoặc Tinh-Siêu Dẫn thì đòn đó được +16% tỷ lệ bạo kích." },
      ],
      mainStats: [
        { slot: "Đồng hồ", stat: "% Tấn Công", note: "Nội tại của Sandrone đều tính theo Tấn Công của bản thân." },
        { slot: "Ly",      stat: "Tăng ST Băng" },
        { slot: "Nón",     stat: "Tỷ Lệ / ST Bạo Kích", note: "Chọn theo chỉ số vũ khí đang có cho cân." },
      ],
      weapons: [
        { tier: "Trấn", name: "Muỗng Trà Siêu Việt",
          icon: IMG + "c/c4/Weapon_A_Teaspoon_of_Transcendence.png/revision/latest",
          note: "Vũ khí riêng của Sandrone." },
        { tier: "5★ thay thế", name: "Hải Đăng Bờ Biển Lau",
          icon: IMG + "6/6c/Weapon_Beacon_of_the_Reed_Sea.png/revision/latest",
          note: "Có tỷ lệ bạo kích và % Tấn Công, dùng ổn." },
        { tier: "5★ thay thế", name: "Đường Cùng Của Sói",
          icon: IMG + "4/4f/Weapon_Wolf%27s_Gravestone.png/revision/latest",
          note: "Thuần tăng Tấn Công." },
        { tier: "4★", name: "Kiếm Li Cốt",
          icon: IMG + "8/88/Weapon_Serpent_Spine.png/revision/latest",
          note: "Vũ khí Battle Pass, tăng sát thương ổn định." },
        { tier: "4★", name: "Nhát Chém Cứu Rỗi",
          icon: IMG + "2/27/Weapon_Blade_of_Atonement.png/revision/latest",
          note: "Vũ khí rèn Snezhnaya. Kích hoạt phản ứng thì +64 Tinh Thông, kích hoạt phản ứng Tinh Tú thì +16% Tấn Công." },
      ],
    },

    notes: [],
  },

  {
    id: "alyosha",
    name: "Alyosha",
    title: "Chiến Khuyển Thần Tốc",
    rarity: 4,
    element: "electro",
    weapon: "polearm",
    role: "Sub-DPS / Support",
    region: "Snezhnaya",
    icon: IMG + "1/1d/Alyosha_Icon.png/revision/latest",

    summary:
      "Sub-DPS Lôi đánh từ ngoài sân, kiêm hồi máu. E gắn Dấu Ấn Săn Bắn lên quái, sau đó chó săn Tugarin từ Q cắn trúng quái có dấu sẽ kích hoạt dấu, tăng Tấn Công cho nhân vật đang đứng sân. Khi đứng trong Vùng Trục Sao, buff này còn tăng thêm 20% ST Tinh-Siêu Dẫn cho cả đội, nên Alyosha rất hợp đi cùng Sandrone.",

    // Tên + icon kỹ năng: genshin-impact.fandom.com/vi/wiki/Alyosha
    skills: [
      {
        key: "BA",
        name: "Ngọn Thương Chớp Nhoáng",
        icon: IMG + "0/06/Polearm_Electro.png/revision/latest",
        desc: "Tấn Công Thường tối đa 4 lần đâm, đòn cuối gắn Dấu Ấn Săn Bắn lên quái trúng đòn. Trọng Kích tiêu hao thể lực, xông về phía trước gây sát thương cho quái trên đường đi.",
      },
      {
        key: "E",
        name: "Phục Kích Sấm Sét",
        icon: IMG + "c/c0/Talent_Thunderbolt_Strike.png/revision/latest",
        desc: "Nhấn: bắn về phía trước, gây ST Lôi diện rộng. Nhấn giữ: vào trạng thái ngắm, khóa quái trong vùng phía trước rồi bắn khi thả nút. Cả hai cách đều gắn Dấu Ấn Săn Bắn và tạo 5 hạt nguyên tố.\nNếu quái đã có dấu mà bị trúng thêm đòn gắn dấu, dấu sẽ được kích hoạt: xóa dấu và cho nhân vật đứng sân hiệu quả Mệnh Lệnh Thợ Săn, tăng Tấn Công trong 15s.",
      },
      {
        key: "Q",
        name: "Thợ Săn Tiến Bước",
        icon: IMG + "4/46/Talent_Hunter%27s_Advance.png/revision/latest",
        desc: "Gọi chó săn Tugarin ra trận và biến vùng phía trước thành Bãi Săn Sấm Rền trong 14s. Bãi Săn khiêu khích quái và mỗi 2s gây ST Lôi lên quái bước vào. Tugarin cứ 2s lao tới cắn một con quái gần đó gây ST Lôi, ưu tiên con có Dấu Ấn Săn Bắn và kích hoạt luôn dấu đó. Mỗi lần Tugarin cắn còn hồi máu cho nhân vật đứng sân (nội tại bậc 1).",
      },
    ],

    teams: [
      {
        name: "Tinh-Siêu Dẫn",
        members: ["sandrone", "alyosha", "diona", "sucrose"],
        rotation: [
          { char: "diona", actions: ["E giữ", "Q"],
            why: "Giữ E để tạo khiên chắc, rồi bật Q để có vùng hồi máu và gắn ấn Băng lên quái." },
          { char: "sucrose", actions: ["E", "Q"],
            why: "Khuếch tán Băng để gom quái lại gần. Nếu Sucrose mang 4 món Bóng Hình Màu Xanh, quái còn bị giảm Kháng Băng." },
          { char: "alyosha", actions: ["E", "Q"],
            why: "Bấm E trước để gắn Dấu Ấn Săn Bắn lên quái, rồi bật Q gọi Tugarin. Từ đây Tugarin cắn trúng quái có dấu sẽ kích hoạt dấu, tăng Tấn Công cho Sandrone, và Lôi của Alyosha gặp ấn Băng có sẵn sẽ mở ra Vùng Trục Sao.",
            warn: "Đừng bật Q trước E. Lúc đó quái chưa có dấu nên mấy phát cắn đầu của Tugarin không kích hoạt được gì, phí mất một đoạn buff." },
          { char: "sandrone", actions: ["CA giữ"],
            why: "Giữ trọng kích để Fagio vào chế độ Giải Mã, liên tục phóng Tia Ngưng Tụ. Đứng trong Vùng Trục Sao, Sandrone vừa được tăng Tấn Công từ Mệnh Lệnh Thợ Săn, vừa được cả đội cộng thêm 20% ST Tinh-Siêu Dẫn nhờ Alyosha." },
          { char: "sandrone", actions: ["E"],
            why: "Khi Công Suất Giải Mã đã lên cao (trên 50, tốt nhất là gần mốc 100), bấm E để hạ công suất xuống và nhận tầng Chiến Thuật Cải Tiến.",
            warn: "Đừng để Fagio chạm 100 rồi mới xử lý, vì lúc đó Fagio Quá Tải, bắn chậm hẳn." },
          { char: "sandrone", actions: ["CA giữ", "Q"],
            why: "Giữ trọng kích thêm một vòng rồi kết thúc bằng Q khi vẫn còn đứng trong Vùng Trục Sao." },
        ],
      },
    ],

    build: {
      stats: [
        { label: "Hiệu quả nạp", target: "160–200%",
          note: "Q tốn 70 năng lượng và nên có mỗi vòng. Nội tại bậc 4 còn đổi Hiệu quả nạp thành sát thương cho E và Q: mỗi 1% nạp thêm 0.35%, tối đa 70% khi nạp đạt 200%." },
        { label: "Bạo kích", target: "~50% / 120%+",
          note: "Tỷ lệ bạo kích / ST bạo kích. Bãi Săn và Tugarin đánh liên tục từ ngoài sân nên có bạo kích ổn thì Alyosha góp thêm khá nhiều sát thương." },
      ],
      artifacts: [
        { set: "Nghi Thức Tông Thất Cổ", pieces: 4,
          icon: IMG + "7/71/Item_Royal_Flora.png/revision/latest",
          note: "2 món: +20% ST Kỹ Năng Nộ.\n4 món: sau khi dùng Q, cả đội +20% Tấn Công trong 12s (không cộng dồn)." },
        { set: "Trái Tim Lửa Nung", pieces: 4,
          icon: IMG + "e/ef/Item_Foundryman%27s_Conjecture.png/revision/latest",
          note: "2 món: +18% Tấn Công.\n4 món: kích hoạt hoặc gây ST Tinh Tú Lấp Lánh thì bản thân +12% Tấn Công trong 12s, cả đội +50% ST Tinh Tú Lấp Lánh. Đứng ngoài sân vẫn kích hoạt được, nên rất hợp với đội Tinh-Siêu Dẫn." },
      ],
      mainStats: [
        { slot: "Đồng hồ", stat: "% Hiệu Quả Nạp", note: "Hoặc % Tấn Công nếu dòng phụ đã đủ nạp." },
        { slot: "Ly",      stat: "Tăng ST Lôi" },
        { slot: "Nón",     stat: "Tỷ Lệ / ST Bạo Kích", note: "Nếu dùng Thương Tây Phong thì ưu tiên Tỷ Lệ Bạo Kích, vì phải bạo kích mới tạo thêm hạt năng lượng." },
      ],
      weapons: [
        { tier: "5★ thay thế", name: "Đoạn Thảo Trường Đao",
          icon: IMG + "2/21/Weapon_Engulfing_Lightning.png/revision/latest",
          note: "Đổi Hiệu quả nạp thành Tấn Công, còn hồi nạp sau khi dùng Q." },
        { tier: "5★ thay thế", name: "Xương Sống Thiên Không",
          icon: IMG + "6/69/Weapon_Skyward_Spine.png/revision/latest",
          note: "Dòng phụ Hiệu quả nạp, nội tại tăng Tỷ Lệ Bạo Kích." },
        { tier: "4★", name: "Thương Tây Phong",
          icon: IMG + "5/57/Weapon_Favonius_Lance.png/revision/latest",
          note: "Đòn bạo kích tạo hạt năng lượng, vừa đủ cho Alyosha tự sạc vừa sạc thêm cho đồng đội." },
        { tier: "4★", name: "Lao Xiên Cá",
          icon: IMG + "f/f5/Weapon_The_Catch.png/revision/latest",
          note: "Vũ khí câu cá miễn phí, tăng ST và Tỷ Lệ Bạo Kích cho Q." },
      ],
    },

    notes: [],
  },

  {
    id: "diona",
    name: "Diona",
    title: "Đặc Chế Quán Rượu Đuôi Mèo",
    rarity: 4,
    element: "cryo",
    weapon: "bow",
    role: "Support / Healer",
    region: "Mondstadt",
    icon: IMG + "4/40/Diona_Icon.png/revision/latest",

    summary:
      "Hỗ trợ Băng vừa tạo khiên vừa hồi máu. E tạo khiên theo Giới hạn HP và gắn Băng cho nhân vật được bảo vệ, Q tạo vùng liên tục gây ST Băng lên quái và hồi máu cho đồng đội. Từ Cung Mệnh 6, nhân vật đứng trong vùng Q còn được +200 Tinh Thông Nguyên Tố.",

    // Tên + icon kỹ năng: genshin-impact.fandom.com/vi/wiki/Diona
    skills: [
      {
        key: "BA",
        name: "Xạ Thuật Thợ Săn",
        icon: IMG + "a/a9/Bow_Cryo.png/revision/latest",
        desc: "Tấn Công Thường tối đa 5 lần bắn tên. Trọng Kích là ngắm bắn: tụ lực đủ lâu thì mũi tên mang hơi lạnh, gây ST Băng.",
      },
      {
        key: "E",
        name: "Móng Mèo Lạnh Giá",
        icon: IMG + "e/e9/Talent_Icy_Paws.png/revision/latest",
        desc: "Bắn Móng Mèo Lạnh Giá gây ST Băng và tạo khiên khi trúng quái. Khiên dày theo Giới hạn HP của Diona, trụ lâu theo số móng bắn trúng, hấp thụ ST Băng hiệu quả gấp 2.5 lần và gắn Băng cho nhân vật được bảo vệ.\nNhấn: bắn nhanh 2 móng (hồi chiêu 6s). Nhấn giữ: lùi lại bắn 5 móng, khiên dày thêm 75% (hồi chiêu 15s).\nĐứng trong khiên được tăng 10% tốc độ chạy và giảm 10% tiêu hao thể lực (nội tại bậc 1).",
      },
      {
        key: "Q",
        name: "Đặc Chế Mãnh Liệt",
        icon: IMG + "5/57/Talent_Signature_Mix.png/revision/latest",
        desc: "Ném viên đá đặc chế gây ST Băng diện rộng, tạo vùng Hơi Rượu Băng trong 12s. Cứ 2s, vùng gây ST Băng lên quái và hồi máu theo Giới hạn HP cho nhân vật đứng trong vùng. Quái trong vùng bị giảm 10% Tấn Công (nội tại bậc 4). Tốn 80 năng lượng.\nCung Mệnh 6: nhân vật đứng trong vùng còn trên 50% HP được +200 Tinh Thông Nguyên Tố, dưới 50% HP thì được tăng 30% lượng trị liệu nhận vào.",
      },
    ],

    teams: [
      {
        name: "Tinh-Siêu Dẫn",
        members: ["sandrone", "alyosha", "diona", "sucrose"],
        rotation: [
          { char: "diona", actions: ["E giữ", "Q"],
            why: "Luôn giữ E để có khiên dày nhất, kèm theo tăng tốc chạy và giảm tiêu hao thể lực. Sau đó bật Q ngay để gắn ấn Băng lên quái và mở vùng hồi máu cho cả đội." },
          { char: "sucrose", actions: ["E", "Q"],
            why: "Khuếch tán Băng để gom quái lại gần. Nếu Sucrose mang 4 món Bóng Hình Màu Xanh, quái còn bị giảm Kháng Băng." },
          { char: "alyosha", actions: ["E", "Q"],
            why: "Bấm E gắn Dấu Ấn Săn Bắn rồi bật Q gọi Tugarin. Lôi của Alyosha gặp ấn Băng mà Diona vừa gắn sẽ kích hoạt Tinh-Siêu Dẫn và mở ra Vùng Trục Sao." },
          { char: "sandrone", actions: ["CA giữ"],
            why: "Giữ trọng kích để Fagio vào chế độ Giải Mã, đứng trong vùng Q của Diona để vừa được hồi máu vừa ăn buff của Vùng Trục Sao. Nếu Diona có Cung Mệnh 6, Sandrone còn được +200 Tinh Thông, mà Tinh Thông lại tăng sát thương Tinh-Siêu Dẫn." },
          { char: "sandrone", actions: ["E"],
            why: "Khi Công Suất Giải Mã đã lên cao (trên 50, tốt nhất là gần mốc 100), bấm E để hạ công suất xuống và nhận tầng Chiến Thuật Cải Tiến.",
            warn: "Đừng để Fagio chạm 100 rồi mới xử lý, vì lúc đó Fagio Quá Tải, bắn chậm hẳn." },
          { char: "sandrone", actions: ["CA giữ", "Q"],
            why: "Giữ trọng kích thêm một vòng rồi kết thúc bằng Q khi vẫn còn đứng trong Vùng Trục Sao." },
        ],
      },
    ],

    build: {
      stats: [
        { label: "Giới hạn HP", target: "25.000–30.000+",
          note: "Độ dày khiên của E và lượng hồi máu của Q đều tính theo Giới hạn HP của Diona." },
        { label: "Hiệu quả nạp", target: "180–200%+",
          note: "Q tốn tới 80 năng lượng, mà vùng Q là nguồn hồi máu (và buff Tinh Thông nếu có Cung Mệnh 6) nên cần có lại mỗi vòng." },
      ],
      artifacts: [
        { set: "Thiên Nham Vững Chắc", pieces: 2,
          icon: IMG + "5/51/Item_Flower_of_Accolades.png/revision/latest",
          note: "2 món: +20% HP." },
        { set: "Thiếu Nữ Đáng Yêu", pieces: 2,
          icon: IMG + "d/dc/Item_Maiden%27s_Distant_Love.png/revision/latest",
          note: "2 món: +15% hiệu quả trị liệu.\nCó thể thay bằng 2 món Xà Cừ Đại Dương, hiệu ứng 2 món giống hệt." },
      ],
      mainStats: [
        { slot: "Đồng hồ", stat: "% HP", note: "Hoặc % Hiệu Quả Nạp nếu thấy Q hay bị thiếu năng lượng." },
        { slot: "Ly",      stat: "% HP", note: "Khiên càng dày." },
        { slot: "Nón",     stat: "% HP / Tăng Trị Liệu", note: "Muốn hồi máu nhiều hơn thì chọn Tăng Trị Liệu, muốn khiên trâu hơn thì chọn % HP." },
      ],
      weapons: [
        { tier: "5★", name: "Tiếng Thở Dài Vô Tận",
          icon: IMG + "a/a5/Weapon_Elegy_for_the_End.png/revision/latest",
          note: "Dòng phụ Hiệu quả nạp. E hoặc Q trúng quái đủ 4 lần thì cả đội +100 Tinh Thông và +20% Tấn Công trong 12s." },
        { tier: "4★", name: "Cung Tế Lễ",
          icon: IMG + "e/ec/Weapon_Sacrificial_Bow.png/revision/latest",
          note: "Dòng phụ Hiệu quả nạp. E gây sát thương có 40% tỷ lệ làm mới hồi chiêu (R1), được dùng E thêm lần nữa để có thêm khiên và hạt năng lượng." },
        { tier: "4★", name: "Cung Tây Phong",
          icon: IMG + "8/85/Weapon_Favonius_Warbow.png/revision/latest",
          note: "Đòn bạo kích tạo thêm hạt năng lượng cho đội. Cần có Tỷ Lệ Bạo Kích ở dòng phụ." },
        { tier: "3★", name: "Cung Phản Khúc",
          icon: IMG + "b/b5/Weapon_Recurve_Bow.png/revision/latest",
          note: "Lựa chọn miễn phí, dòng phụ % HP cao giúp khiên dày hơn." },
      ],
    },

    notes: [],
  },

  {
    id: "sucrose",
    name: "Sucrose",
    title: "Độ Ngọt Vô Hại",
    rarity: 4,
    element: "anemo",
    weapon: "catalyst",
    role: "Support / Gom quái",
    region: "Mondstadt",
    icon: IMG + "0/0e/Sucrose_Icon.png/revision/latest",

    summary:
      "Hỗ trợ Phong gom quái và chia Tinh Thông cho cả đội. E và Q hút quái về một chỗ, trúng quái thì đồng đội được cộng 20% Tinh Thông của Sucrose. Mang 4 món Bóng Hình Màu Xanh, mỗi lần khuếch tán sẽ giảm kháng nguyên tố của quái. Có Sandrone trong đội thì khuếch tán Băng thành Tinh-Khuếch Tán.",

    // Tên + icon kỹ năng: genshin-impact.fandom.com/vi/wiki/Sucrose
    skills: [
      {
        key: "BA",
        name: "Gió Thần Sáng Tạo",
        icon: IMG + "d/dd/Catalyst_Anemo.png/revision/latest",
        desc: "Tấn Công Thường tối đa 4 lần đánh bằng phong linh, gây ST Phong. Trọng Kích tiêu hao thể lực, sau một nhịp niệm thì gây ST Phong diện rộng.",
      },
      {
        key: "E",
        name: "Gió Thần Sáng Tạo 6308",
        icon: IMG + "7/76/Talent_Astable_Anemohypostasis_Creation_-_6308.png/revision/latest",
        desc: "Gọi một phong linh nhỏ hút quái và vật thể về phía nó, rồi hất văng quái xung quanh, gây ST Phong. Trúng quái tạo 4 hạt nguyên tố.\nE hoặc Q trúng quái thì cả đội (trừ Sucrose) được cộng thêm 20% Tinh Thông Nguyên Tố của Sucrose trong 8s (nội tại bậc 4).",
      },
      {
        key: "Q",
        name: "Cấm-Gió Thần Sáng Tạo-75 Loại 2",
        icon: IMG + "4/4d/Talent_Forbidden_Creation_-_Isomer_75_Type_II.png/revision/latest",
        desc: "Ném bình tạo một phong linh lớn trong 6s, liên tục hút và hất văng quái, gây ST Phong. Nếu chạm phải Thủy, Hỏa, Băng hoặc Lôi, phong linh sẽ hấp thụ nguyên tố đó (chỉ một lần) và gây thêm sát thương của nguyên tố ấy. Tốn 80 năng lượng.\nKhi Sucrose khuếch tán một nguyên tố, đồng đội cùng nguyên tố đó được +50 Tinh Thông trong 8s (nội tại bậc 1).",
      },
    ],

    teams: [
      {
        name: "Tinh-Siêu Dẫn",
        members: ["sandrone", "alyosha", "diona", "sucrose"],
        rotation: [
          { char: "diona", actions: ["E giữ", "Q"],
            why: "Giữ E để tạo khiên chắc, rồi bật Q để có vùng hồi máu và gắn ấn Băng lên quái." },
          { char: "sucrose", actions: ["E", "Q"],
            why: "Bấm E gom quái lại một chỗ, rồi bật Q. Q của Sucrose sẽ hấp thụ Băng từ Diona và khuếch tán ấn Băng trên quái thành Tinh-Khuếch Tán. Với 4 món Bóng Hình Màu Xanh, quái bị giảm 40% Kháng Băng trong 10s, còn cả đội được cộng Tinh Thông từ Sucrose.",
            warn: "Nhớ để Diona gắn Băng trước rồi mới ra Sucrose. Nếu Q của Sucrose chạm Lôi trước, phong linh sẽ hấp thụ Lôi và quái chỉ bị giảm Kháng Lôi." },
          { char: "alyosha", actions: ["E", "Q"],
            why: "Bấm E gắn Dấu Ấn Săn Bắn rồi bật Q gọi Tugarin. Lôi của Alyosha gặp ấn Băng trên quái sẽ kích hoạt Tinh-Siêu Dẫn và mở ra Vùng Trục Sao." },
          { char: "sandrone", actions: ["CA giữ"],
            why: "Giữ trọng kích để Fagio vào chế độ Giải Mã. Lúc này quái vừa bị giảm Kháng Băng, Sandrone lại đang được cộng Tinh Thông từ Sucrose, mà Tinh Thông làm tăng sát thương Tinh-Siêu Dẫn." },
          { char: "sandrone", actions: ["E"],
            why: "Khi Công Suất Giải Mã đã lên cao (trên 50, tốt nhất là gần mốc 100), bấm E để hạ công suất xuống và nhận tầng Chiến Thuật Cải Tiến.",
            warn: "Đừng để Fagio chạm 100 rồi mới xử lý, vì lúc đó Fagio Quá Tải, bắn chậm hẳn." },
          { char: "sandrone", actions: ["CA giữ", "Q"],
            why: "Giữ trọng kích thêm một vòng rồi kết thúc bằng Q khi vẫn còn đứng trong Vùng Trục Sao." },
        ],
      },
    ],

    build: {
      stats: [
        { label: "Tinh Thông Nguyên Tố", target: "400–600+",
          note: "Tinh Thông càng cao thì Tinh-Khuếch Tán càng mạnh, và 20% số Tinh Thông đó còn được chia cho cả đội, giúp Sandrone tăng sát thương Tinh-Siêu Dẫn." },
        { label: "Hiệu quả nạp", target: "160–180%+",
          note: "Q tốn 80 năng lượng, nên có lại mỗi vòng để gom quái và khuếch tán Băng." },
      ],
      artifacts: [
        { set: "Bóng Hình Màu Xanh", pieces: 4,
          icon: IMG + "9/90/Item_In_Remembrance_of_Viridescent_Fields.png/revision/latest",
          note: "2 món: +15% ST Phong.\n4 món: ST Khuếch Tán +60%, ST Tinh-Khuếch Tán +20%. Quái bị khuếch tán nguyên tố nào thì giảm 40% kháng nguyên tố đó trong 10s, Tinh-Khuếch Tán thì giảm 40% Kháng Băng." },
      ],
      mainStats: [
        { slot: "Đồng hồ", stat: "Tinh Thông Nguyên Tố", note: "Hoặc % Hiệu Quả Nạp nếu Q hay bị thiếu năng lượng." },
        { slot: "Ly",      stat: "Tinh Thông Nguyên Tố" },
        { slot: "Nón",     stat: "Tinh Thông Nguyên Tố", note: "Hoặc Tỷ Lệ Bạo Kích nếu dùng Tây Phong Mật Điển để sạc năng lượng cho đội." },
      ],
      weapons: [
        { tier: "4★", name: "Mảnh Chương Tế Lễ",
          icon: IMG + "6/6c/Weapon_Sacrificial_Fragments.png/revision/latest",
          note: "Dòng phụ Tinh Thông rất cao. E gây sát thương có 40% tỷ lệ làm mới hồi chiêu (R1), được ném E thêm lần nữa để có thêm hạt năng lượng." },
        { tier: "3★", name: "Câu Chuyện Diệt Rồng",
          icon: IMG + "1/19/Weapon_Thrilling_Tales_of_Dragon_Slayers.png/revision/latest",
          note: "Vũ khí 3★ dễ kiếm. Đổi từ Sucrose sang nhân vật khác thì nhân vật đó được +24% Tấn Công trong 10s (R5 là +48%)." },
        { tier: "4★", name: "Tây Phong Mật Điển",
          icon: IMG + "3/36/Weapon_Favonius_Codex.png/revision/latest",
          note: "Dòng phụ Hiệu quả nạp, bạo kích tạo thêm hạt năng lượng. Hợp khi cả đội đang thiếu năng lượng để dùng Q." },
      ],
    },

    notes: [],
  },

  {
    id: "mitya",
    name: "Mitya",
    title: "Vạn Luật Hư Danh",
    rarity: 5,
    element: "electro",
    weapon: "catalyst",
    role: "Main DPS / Sub-DPS",
    region: "Snezhnaya",
    icon: IMG + "f/fd/Mitya_Icon.png/revision/latest",

    summary:
      "DPS Lôi xoay quanh Tinh-Siêu Dẫn và Tinh Thông Nguyên Tố. Khi có Mitya, Tinh-Siêu Dẫn không tạo Pha Lê Tinh Huy nữa mà tạo Tín Hiệu Biến Đổi, Mitya mang theo các tín hiệu này để mở Vùng Trục Sao rộng hơn. Sau đó Mitya dùng Trọng Kích đặc biệt tiêu hao tín hiệu, mỗi tín hiệu gây một đòn ST Lôi tính là sát thương Tinh-Siêu Dẫn.",

    // Tên kỹ năng: mục "Other Languages" trên genshin-impact.fandom.com/wiki/Mitya (wiki vi chưa có trang kỹ năng)
    skills: [
      {
        key: "BA",
        name: "Phản Ứng Dây Chuyền",
        icon: IMG + "e/e7/Catalyst_Electro.png/revision/latest",
        desc: "Tấn Công Thường tối đa 3 đòn ST Lôi. Trọng Kích tiêu hao thể lực, gây ST Lôi diện rộng phía trước.\nNếu trên sân đang có Lõi Dò Tìm ở trạng thái Quá Tải do Mitya tạo ra và Mitya có ít nhất 1 Tín Hiệu Biến Đổi, Trọng Kích đổi thành Kích Nổ Biến Đổi: không tốn thể lực, giữ nút để liên tục tiêu hao tín hiệu, mỗi tín hiệu gây một đòn ST Lôi diện rộng tính là ST Tinh-Siêu Dẫn (theo Tinh Thông Nguyên Tố).",
      },
      {
        key: "E",
        name: "Quy Luật - Dò Tìm Biến Số",
        icon: IMG + "0/00/Talent_Principle_Variable_Detection.png/revision/latest",
        desc: "Gây ST Lôi diện rộng và tạo Lõi Dò Tìm tồn tại 25s (hồi chiêu 18s). Nhấn và nhấn giữ sẽ tạo lõi theo cách khác nhau. Bấm E lần nữa trong vòng 6s thì đổi trạng thái của lõi, tối đa mỗi 1.5s một lần.\nLõi Ổn Định: cả đội được +30 Tinh Thông cho mỗi Tín Hiệu Biến Đổi Mitya đang có. Lõi Quá Tải: sau khi đồng đội kích hoạt Tinh-Siêu Dẫn, cứ 1.5s Mitya nhận 1 tín hiệu, trong 6s (nội tại bậc 1).",
      },
      {
        key: "Q",
        name: "Phân Tích - Nguyên Lý Biến Đổi",
        icon: IMG + "d/df/Talent_Analysis_Gradient_Theory.png/revision/latest",
        desc: "Gây ST Lôi diện rộng (theo cả Tấn Công lẫn Tinh Thông) và tạo ngay 3 Tín Hiệu Biến Đổi. Tốn 60 năng lượng, hồi chiêu 15s.\nTín hiệu tồn tại 10s. Mỗi lần tạo tín hiệu, Mitya được +5% Tỷ Lệ Bạo Kích trong 15s, cộng dồn tối đa 4 lần (nội tại bậc 4).",
      },
    ],

    teams: [
      {
        name: "Tinh-Siêu Dẫn",
        members: ["mitya", "sandrone", "odette", "alyosha"],
        rotation: [
          { char: "odette", actions: ["E", "Q"],
            why: "E gọi bóng múa của Odette ra sân, liên tục gây ST Băng diện rộng. Nhờ vậy quái luôn có ấn Băng để Lôi của Alyosha và Mitya kích hoạt Tinh-Siêu Dẫn." },
          { char: "alyosha", actions: ["E", "Q"],
            why: "Bấm E gắn Dấu Ấn Săn Bắn rồi bật Q gọi Tugarin. Tugarin cắn trúng quái có dấu sẽ tăng Tấn Công cho nhân vật đứng sân, Lôi của Alyosha gặp ấn Băng thì kích hoạt Tinh-Siêu Dẫn." },
          { char: "sandrone", actions: ["E", "Q"],
            why: "Sandrone xả E và Q để gây ST Băng diện rộng, tiếp tục kích hoạt Tinh-Siêu Dẫn. Với Mitya trong đội, mỗi lần Tinh-Siêu Dẫn sẽ tạo Tín Hiệu Biến Đổi cho Mitya nhặt." },
          { char: "mitya", actions: ["E giữ", "Q"],
            why: "Dùng E để tạo Lõi Dò Tìm ở trạng thái Quá Tải, rồi bật Q để có ngay 3 Tín Hiệu Biến Đổi. Mỗi tín hiệu còn cộng thêm Tỷ Lệ Bạo Kích cho Mitya.",
            warn: "Lõi phải ở trạng thái Quá Tải thì Trọng Kích mới đổi thành Kích Nổ Biến Đổi. Nếu lõi đang ở trạng thái Ổn Định, bấm E thêm một lần trong 6s để đổi trạng thái." },
          { char: "mitya", actions: ["CA giữ"],
            why: "Giữ trọng kích để xả Kích Nổ Biến Đổi, tiêu hết số tín hiệu đang mang. Mỗi tín hiệu là một đòn ST Lôi tính là sát thương Tinh-Siêu Dẫn. Trong lúc đó đồng đội tiếp tục kích hoạt Tinh-Siêu Dẫn sẽ nạp thêm tín hiệu cho Mitya." },
        ],
      },
    ],

    build: {
      stats: [
        { label: "Bạo kích", target: "~50% / 200%+",
          note: "Tỷ lệ bạo kích / ST bạo kích. Nội tại bậc 4 cộng thêm tới 20% Tỷ Lệ Bạo Kích khi Mitya tạo tín hiệu, nên không cần dồn quá nhiều Tỷ Lệ Bạo Kích ở dòng phụ." },
        { label: "Tinh Thông Nguyên Tố", target: "300–500",
          note: "Đòn Kích Nổ Biến Đổi tính sát thương theo Tinh Thông, nên Tinh Thông càng cao thì Mitya đánh càng đau." },
        { label: "Hiệu quả nạp", target: "~120%",
          note: "Q chỉ tốn 60 năng lượng, nạp vừa đủ để có Q mỗi vòng là được." },
      ],
      artifacts: [
        { set: "Giấc Mộng Hoàng Kim", pieces: 4,
          icon: IMG + "0/0c/Item_Dreaming_Steelbloom.png/revision/latest",
          note: "2 món: +80 Tinh Thông.\n4 món: trong 8s sau khi kích hoạt phản ứng, mỗi đồng đội cùng nguyên tố cho +14% Tấn Công, mỗi đồng đội khác nguyên tố cho +50 Tinh Thông (tính tối đa 3 người). Đứng ngoài sân vẫn kích hoạt được." },
      ],
      mainStats: [
        { slot: "Đồng hồ", stat: "Tinh Thông Nguyên Tố", note: "Tinh Thông làm tăng trực tiếp sát thương Tinh-Siêu Dẫn của Mitya." },
        { slot: "Ly",      stat: "Tinh Thông Nguyên Tố", note: "Hoặc Tăng ST Lôi nếu chơi đứng sân, dồn bạo kích." },
        { slot: "Nón",     stat: "Tỷ Lệ / ST Bạo Kích", note: "Chọn theo dòng phụ cho cân." },
      ],
      weapons: [
        { tier: "Trấn", name: "Starsealed Edict",
          icon: IMG + "3/35/Weapon_Starsealed_Edict.png/revision/latest",
          note: "Pháp khí 5★ ra cùng Mitya, wiki chưa có tên tiếng Việt. Dòng phụ ST Bạo Kích, dùng E thì tăng Tinh Thông. Khi đang Tỏa Sáng, còn tăng ST Bạo Kích cho Tinh-Siêu Dẫn của người cầm." },
        { tier: "5★ thay thế", name: "Chân Ý Của Kagura",
          icon: IMG + "b/b7/Weapon_Kagura%27s_Verity.png/revision/latest",
          note: "Dòng phụ ST Bạo Kích. Mỗi lần dùng E được +12% ST Kỹ Năng Nguyên Tố và +12% ST Tinh-Siêu Dẫn, cộng dồn 3 lần." },
        { tier: "4★", name: "Mảnh Chương Tế Lễ",
          icon: IMG + "6/6c/Weapon_Sacrificial_Fragments.png/revision/latest",
          note: "Dòng phụ Tinh Thông rất cao. E có 40% tỷ lệ làm mới hồi chiêu (R1)." },
        { tier: "4★", name: "Quả Mọng",
          icon: IMG + "9/98/Weapon_Fruit_of_Fulfillment.png/revision/latest",
          note: "Vũ khí rèn. Dòng phụ Hiệu quả nạp, kích hoạt phản ứng thì tăng dần Tinh Thông (đổi lại giảm một ít Tấn Công)." },
      ],
    },

    notes: [],
  },

  {
    id: "odette",
    name: "Odette",
    title: "Vòng Xoay Tuyết Trắng",
    rarity: 5,
    element: "cryo",
    weapon: "sword",
    role: "Sub-DPS / Support",
    region: "Snezhnaya",
    icon: IMG + "8/87/Odette_Icon.png/revision/latest",

    summary:
      "Sub-DPS Băng đánh từ ngoài sân bằng Bóng Hình Độc Diễn. Có Odette trong đội thì Siêu Dẫn và Khuếch Tán Băng thành Tinh-Siêu Dẫn và Tinh-Khuếch Tán, sát thương gốc của hai phản ứng này còn tăng theo Tấn Công của Odette. Mỗi lần gọi Bóng Hình, Odette nhận 4 tầng Lộng Lẫy và chia dần cho đồng đội khi đứng ngoài sân.",

    // Tên + icon kỹ năng: genshin-impact.fandom.com/vi/wiki/Odette
    skills: [
      {
        key: "BA",
        name: "Biến Tấu Thiên Nga Tuyết",
        icon: IMG + "6/6a/Sword_Cryo.png/revision/latest",
        desc: "Tấn Công Thường tối đa 5 nhát kiếm. Trọng Kích tiêu hao thể lực, vung một nhát chém rực rỡ về phía trước.",
      },
      {
        key: "E",
        name: "Nhịp Chậm - Điệu Múa Đêm Huyền Ảo",
        icon: IMG + "1/15/Talent_Adagio_Phantom_Night_Dancers.png/revision/latest",
        desc: "Gây ST Băng diện rộng và gọi Bóng Hình Độc Diễn (tồn tại 20s), cứ 2s múa một lần gây ST Băng quanh đó. Hồi chiêu 15s.\nTrong 6s sau khi dùng E hoặc Q, E đổi thành Nhịp Chậm - Đoạn Kết Ánh Bình Minh: múa đôi gây ST Băng liên tục, kết thúc bằng một đòn tính là ST Tinh-Siêu Dẫn (hoặc Tinh-Khuếch Tán). Khi đang Tỏa Sáng, các điệu múa của Bóng Hình về sau cũng gây thêm sát thương Tinh Tú Lấp Lánh.",
      },
      {
        key: "Q",
        name: "Nhịp Nhanh - Mộng Ước Cánh Chim Xanh",
        icon: IMG + "5/5a/Talent_Presto_Bluebird_Finale.png/revision/latest",
        desc: "Nhảy dồn dập, gây nhiều lần ST Băng diện rộng, gọi Bóng Hình Độc Diễn về cạnh mình và làm mới thời gian của nó. Odette nhận Giấc Mơ Thiên Nga Tuyết trong 20s, tăng sát thương Tinh Tú Lấp Lánh do mình gây ra. Tốn 60 năng lượng, hồi chiêu 15s.",
      },
    ],

    teams: [
      {
        name: "Tinh-Siêu Dẫn",
        members: ["odette", "sandrone", "alyosha", "sucrose"],
        rotation: [
          { char: "odette", actions: ["E"],
            why: "Gây ST Băng diện rộng và gọi Bóng Hình Độc Diễn ra sân để bắt đầu gắn Băng từ ngoài sân. Mỗi lần gọi Bóng Hình, Odette nhận 4 tầng Lộng Lẫy." },
          { char: "sucrose", actions: ["E", "Q"],
            why: "Gom quái lại gần nhau và khuếch tán ấn Băng từ Bóng Hình thành Tinh-Khuếch Tán. Với 4 món Bóng Hình Màu Xanh, quái bị giảm 40% Kháng Băng trong 10s." },
          { char: "alyosha", actions: ["E", "Q"],
            why: "Bấm E gắn Dấu Ấn Săn Bắn rồi bật Q gọi Tugarin, Alyosha đánh Lôi từ ngoài sân. Lôi gặp ấn Băng có sẵn sẽ liên tục kích hoạt Tinh-Siêu Dẫn, còn Tugarin cắn trúng quái có dấu thì tăng Tấn Công cho nhân vật đứng sân." },
          { char: "odette", actions: ["Q", "E"],
            why: "Bật Q để gọi lại Bóng Hình (nhận lại 4 tầng Lộng Lẫy) và có Giấc Mơ Thiên Nga Tuyết, rồi bấm E ngay để dùng Đoạn Kết Ánh Bình Minh, múa đôi xả ST Băng liên tục cùng Lôi của Alyosha.",
            warn: "Đừng chậm quá 6s sau Q, vì hết khoảng đó E quay về bản thường và mất đòn Đoạn Kết Ánh Bình Minh." },
          { char: "sandrone", actions: ["E", "Q", "CA giữ"],
            why: "Đổi Sandrone ra sân để nhận dần các tầng Lộng Lẫy từ Odette, rồi xả E, Q và giữ trọng kích. Bóng Hình của Odette và Tugarin của Alyosha vẫn đánh từ ngoài sân, giữ cho Tinh-Siêu Dẫn nổ liên tục." },
        ],
      },
      {
        name: "Tinh-Khuếch Tán",
        members: ["mizuki", "odette", "traveler-cryo", "sucrose"],
        rotation: [
          { char: "traveler-cryo", actions: ["E", "Q"],
            why: "E tạo một ngôi sao băng đi theo đội, định kỳ bắn tinh thể băng gây ST Băng từ ngoài sân, nhờ vậy quái luôn có ấn Băng để Phong khuếch tán. Sau đó bật Q." },
          { char: "sucrose", actions: ["E", "Q"],
            why: "Gom quái lại một chỗ và khuếch tán Băng thành Tinh-Khuếch Tán. Với 4 món Bóng Hình Màu Xanh, quái bị giảm 40% Kháng Băng trong 10s." },
          { char: "odette", actions: ["Q", "E"],
            why: "Bật Q để gọi Bóng Hình Độc Diễn (nhận 4 tầng Lộng Lẫy) và có Giấc Mơ Thiên Nga Tuyết, rồi bấm E ngay để dùng Đoạn Kết Ánh Bình Minh. Đòn kết thúc của điệu múa đôi tính là sát thương Tinh-Khuếch Tán.",
            warn: "Đừng chậm quá 6s sau Q, vì hết khoảng đó E quay về bản thường và mất đòn Đoạn Kết Ánh Bình Minh." },
          { char: "mizuki", actions: ["E"],
            why: "Đổi Mizuki ra sân, bấm E để vào trạng thái Mộng Trôi: Mizuki lơ lửng trôi về phía trước, liên tục gây ST Phong và khuếch tán Băng thành Tinh-Khuếch Tán. Trong trạng thái này, cả đội được tăng ST Tinh-Khuếch Tán theo Tinh Thông của Mizuki, còn Mizuki nhận dần các tầng Lộng Lẫy từ Odette.",
            warn: "Trong trạng thái Mộng Trôi, Mizuki không đánh thường hay trọng kích được, chỉ cần điều khiển hướng trôi cho trúng quái." },
        ],
      },
    ],

    build: {
      stats: [
        { label: "Tấn Công", target: "2.800–3.000+",
          note: "Phần Tấn Công vượt quá 1000 tăng sát thương Tinh Tú Lấp Lánh của chính Odette (tối đa +30%). Nội tại Chúc Phúc Tinh Tú cũng tăng sát thương gốc Tinh-Siêu Dẫn và Tinh-Khuếch Tán của cả đội theo Tấn Công của Odette (tối đa +14%)." },
        { label: "Tỷ lệ bạo kích", target: "~70–85%",
          note: "Bóng Hình Độc Diễn đánh liên tục từ ngoài sân nên cần bạo kích ổn định. Odette đột phá đã tăng ST Bạo Kích, nên dòng phụ ưu tiên Tỷ Lệ Bạo Kích." },
        { label: "Hiệu quả nạp", target: "~140–160%",
          note: "Q tốn 60 năng lượng và nên có mỗi vòng để gọi lại Bóng Hình." },
        { label: "Tinh Thông Nguyên Tố", target: "~200–300+",
          note: "Chỉ cần khi chơi đội Tinh-Khuếch Tán. Tinh Thông làm tăng sát thương Tinh Tú Lấp Lánh, nên thêm chút Tinh Thông ở dòng phụ giúp các đòn Tinh-Khuếch Tán của Odette đau hơn." },
      ],
      artifacts: [
        { set: "Trái Tim Lửa Nung", pieces: 4,
          icon: IMG + "e/ef/Item_Foundryman%27s_Conjecture.png/revision/latest",
          note: "2 món: +18% Tấn Công.\n4 món: kích hoạt hoặc gây ST Tinh Tú Lấp Lánh thì bản thân +12% Tấn Công trong 12s, cả đội +50% ST Tinh Tú Lấp Lánh. Đứng ngoài sân vẫn kích hoạt được." },
        { set: "Ảo Tưởng Vụn Vỡ Trong Bóng Tối", pieces: 4,
          icon: IMG + "5/5c/Item_Iridescence_That_Ceased_Amidst_Glory.png/revision/latest",
          note: "Lựa chọn thay thế.\n2 món: +18% Tấn Công.\n4 món: ST Siêu Dẫn +80%, ST Tinh-Siêu Dẫn +40%. Đánh quái đang dính Siêu Dẫn hoặc Tinh-Siêu Dẫn thì đòn đó được +16% tỷ lệ bạo kích." },
      ],
      mainStats: [
        { slot: "Đồng hồ", stat: "% Tấn Công", note: "Giúp dễ chạm mốc 2.800–3.000+ Tấn Công." },
        { slot: "Ly",      stat: "Tăng ST Băng", note: "Hoặc % Tấn Công nếu tổng Tấn Công còn thiếu." },
        { slot: "Nón",     stat: "Tỷ Lệ / ST Bạo Kích", note: "Chọn theo chỉ số vũ khí đang có cho cân." },
      ],
      weapons: [
        { tier: "Trấn", name: "Bạch Hồ Đông Vũ",
          icon: IMG + "e/ec/Weapon_Whitelake_Frostfeather.png/revision/latest",
          note: "Vũ khí riêng của Odette, dòng phụ Tỷ Lệ Bạo Kích. E trúng quái thì +8% Tấn Công, cộng dồn 3 tầng. Đủ 3 tầng thì sát thương Tinh Tú Lấp Lánh của người cầm được +50% ST Bạo Kích, còn hồi thêm năng lượng." },
        { tier: "5★ thay thế", name: "Lời Thề Tự Do Cổ Xưa",
          icon: IMG + "3/39/Weapon_Freedom-Sworn.png/revision/latest",
          note: "Dòng phụ Tinh Thông, +10% sát thương. Kích hoạt phản ứng đủ 2 lần thì cả đội +20% Tấn Công trong 12s." },
        { tier: "4★", name: "Thiết Phong Kích",
          icon: IMG + "3/35/Weapon_Iron_Sting.png/revision/latest",
          note: "Dòng phụ Tinh Thông, hợp với đội Tinh-Khuếch Tán. Gây sát thương nguyên tố thì +6% sát thương, cộng dồn 2 lần." },
        { tier: "4★", name: "Tây Phong Kiếm",
          icon: IMG + "9/90/Weapon_Favonius_Sword.png/revision/latest",
          note: "Dòng phụ Hiệu quả nạp, bạo kích tạo thêm hạt năng lượng. Hợp khi đội đang thiếu năng lượng." },
        { tier: "3★", name: "Thần Kiếm Lê Minh",
          icon: IMG + "2/23/Weapon_Harbinger_of_Dawn.png/revision/latest",
          note: "Vũ khí 3★ dễ kiếm, dòng phụ ST Bạo Kích cao. Nội tại chỉ có tác dụng khi HP trên 90%." },
      ],
    },

    notes: [],
  },

  {
    id: "mizuki",
    name: "Mizuki",
    title: "Ảo Mộng Trùng Điệp",
    rarity: 5,
    element: "anemo",
    weapon: "catalyst",
    role: "Main DPS",
    region: "Inazuma",
    icon: IMG + "f/f6/Yumemizuki_Mizuki_Icon.png/revision/latest",

    summary:
      "Yumemizuki Mizuki, DPS Phong đứng sân dựa vào phản ứng Khuếch Tán. E đưa Mizuki vào trạng thái Mộng Trôi: lơ lửng trôi về phía trước, liên tục gây ST Phong quanh mình, đồng thời tăng sát thương Khuếch Tán và Tinh-Khuếch Tán của cả đội theo Tinh Thông của Mizuki. Q hút quái và gọi Mini Baku rải đồ ăn vặt vừa nổ ST Phong vừa hồi máu.",

    // Tên + icon kỹ năng: genshin-impact.fandom.com/vi/wiki/Yumemizuki_Mizuki
    skills: [
      {
        key: "BA",
        name: "Giấc Mơ Thuần Khiết",
        icon: IMG + "d/dd/Catalyst_Anemo.png/revision/latest",
        desc: "Tấn Công Thường tối đa 3 đòn ST Phong. Trọng Kích tiêu hao thể lực, tụ lực rồi gây ST Phong diện rộng.",
      },
      {
        key: "E",
        name: "Hành Trình Aisa Utamakura",
        icon: IMG + "5/54/Talent_Aisa_Utamakura_Pilgrimage.png/revision/latest",
        desc: "Gây ST Phong diện rộng và vào trạng thái Mộng Trôi (5s): Mizuki lơ lửng trôi về phía trước, điều khiển được hướng, định kỳ gây ST Phong quanh mình. Trong lúc này cả đội được tăng sát thương Khuếch Tán theo Tinh Thông của Mizuki. Rời sân hoặc bấm E lần nữa thì kết thúc. Hồi chiêu 15s.\nMỗi lần khuếch tán trong Mộng Trôi kéo dài thêm 2.5s, tối đa 2 lần (nội tại bậc 1). Đồng đội đánh Hỏa, Thủy, Băng, Lôi trúng quái thì Mizuki +100 Tinh Thông trong 4s (nội tại bậc 4).",
      },
      {
        key: "Q",
        name: "Liệu Pháp Bí Truyền Anraku",
        icon: IMG + "b/bc/Talent_Anraku_Secret_Spring_Therapy.png/revision/latest",
        desc: "Hút quái và vật thể lại gần, gây ST Phong diện rộng và gọi Mini Baku đi theo nhân vật đứng sân trong 12s. Mini Baku định kỳ tạo Đồ Ăn Vặt Yumemi: người nhặt còn trên 70% HP thì đồ ăn nổ gây ST Phong, còn không thì hồi máu theo Tinh Thông của Mizuki. Tốn 60 năng lượng.",
      },
    ],

    teams: [
      {
        name: "Tinh-Khuếch Tán",
        members: ["mizuki", "odette", "traveler-cryo", "sucrose"],
        rotation: [
          { char: "traveler-cryo", actions: ["E", "Q"],
            why: "E tạo một ngôi sao băng đi theo đội, định kỳ bắn tinh thể băng gây ST Băng từ ngoài sân, nhờ vậy quái luôn có ấn Băng để Phong khuếch tán. Sau đó bật Q." },
          { char: "sucrose", actions: ["E", "Q"],
            why: "Gom quái lại một chỗ và khuếch tán Băng thành Tinh-Khuếch Tán. Với 4 món Bóng Hình Màu Xanh, quái bị giảm 40% Kháng Băng trong 10s." },
          { char: "odette", actions: ["Q", "E"],
            why: "Bật Q để gọi Bóng Hình Độc Diễn (nhận 4 tầng Lộng Lẫy), rồi bấm E ngay để dùng Đoạn Kết Ánh Bình Minh. Khi Odette rời sân, các tầng Lộng Lẫy sẽ chuyển dần cho Mizuki.",
            warn: "Đừng chậm quá 6s sau Q, vì hết khoảng đó E quay về bản thường." },
          { char: "mizuki", actions: ["Q", "E"],
            why: "Bật Q để hút quái lại và gọi Mini Baku, rồi bấm E vào Mộng Trôi. Lúc này Mizuki liên tục khuếch tán ấn Băng từ Odette và Nhà Lữ Hành thành Tinh-Khuếch Tán, mỗi lần khuếch tán còn kéo dài Mộng Trôi thêm 2.5s.",
            warn: "Trong Mộng Trôi, Mizuki không đánh thường hay trọng kích được, chỉ cần điều khiển hướng trôi cho trúng quái." },
        ],
      },
    ],

    build: {
      stats: [
        { label: "Tinh Thông Nguyên Tố", target: "~500–600+",
          note: "Mộng Trôi tăng sát thương Khuếch Tán của cả đội theo Tinh Thông của Mizuki, và Tinh Thông cũng làm tăng sát thương Tinh-Khuếch Tán. Mizuki đột phá cũng tăng Tinh Thông." },
        { label: "Hiệu quả nạp", target: "~120–130%",
          note: "Q chỉ tốn 60 năng lượng, có Sucrose đi kèm nên không cần quá nhiều nạp." },
      ],
      artifacts: [
        { set: "Bóng Hình Màu Xanh", pieces: 4,
          icon: IMG + "9/90/Item_In_Remembrance_of_Viridescent_Fields.png/revision/latest",
          note: "2 món: +15% ST Phong.\n4 món: ST Khuếch Tán +60%, ST Tinh-Khuếch Tán +20%. Quái bị khuếch tán nguyên tố nào thì giảm 40% kháng nguyên tố đó trong 10s, Tinh-Khuếch Tán thì giảm 40% Kháng Băng." },
      ],
      mainStats: [
        { slot: "Đồng hồ", stat: "Tinh Thông Nguyên Tố" },
        { slot: "Ly",      stat: "Tinh Thông Nguyên Tố", note: "Tăng ST Phong chỉ làm đòn đánh của chính Mizuki mạnh hơn, không tăng sát thương Khuếch Tán." },
        { slot: "Nón",     stat: "Tinh Thông Nguyên Tố", note: "Sát thương Khuếch Tán bình thường không bạo kích được, nên dòng bạo kích ít tác dụng." },
      ],
      weapons: [
        { tier: "Trấn", name: "Hòa Giấc Trong Nắng Mai",
          icon: IMG + "9/91/Weapon_Sunny_Morning_Sleep-In.png/revision/latest",
          note: "Pháp khí 5★ riêng của Mizuki, dòng phụ Tinh Thông. Kích hoạt Khuếch Tán thì +120 Tinh Thông, E trúng quái thêm +96, Q trúng quái thêm +32." },
        { tier: "4★", name: "Sao Đêm Rong Ruổi",
          icon: IMG + "4/44/Weapon_Wandering_Evenstar.png/revision/latest",
          note: "Dòng phụ Tinh Thông. Định kỳ đổi một phần Tinh Thông thành Tấn Công cho bản thân và đồng đội." },
        { tier: "4★", name: "Mảnh Chương Tế Lễ",
          icon: IMG + "6/6c/Weapon_Sacrificial_Fragments.png/revision/latest",
          note: "Dòng phụ Tinh Thông rất cao. E có 40% tỷ lệ làm mới hồi chiêu (R1)." },
      ],
    },

    notes: [],
  },

  // ---- Nhân vật phụ: điền thêm build / rotation sau ----
  { id: "traveler-cryo", name: "Nhà Lữ Hành (Băng)", rarity: 5, element: "cryo", weapon: "sword", role: "Sub-DPS", region: "Snezhnaya",
    icon: IMG + "5/59/Traveler_Icon.png/revision/latest" },
  { id: "xilonen", name: "Xilonen", rarity: 5, element: "geo",  weapon: "sword",    role: "Support", region: "Natlan",
    icon: IMG + "a/ab/Xilonen_Icon.png/revision/latest" },
  { id: "bennett", name: "Bennett", rarity: 4, element: "pyro", weapon: "sword",    role: "Support", region: "Mondstadt",
    icon: IMG + "7/79/Bennett_Icon.png/revision/latest" },
  { id: "citlali", name: "Citlali", rarity: 5, element: "cryo", weapon: "catalyst", role: "Support", region: "Natlan",
    icon: IMG + "d/dd/Citlali_Icon.png/revision/latest" },
];
