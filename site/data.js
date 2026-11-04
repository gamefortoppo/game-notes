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
  "Tinh Tú Lấp Lánh": "Tên gọi chung cho nhóm phản ứng Băng đặc biệt chỉ xuất hiện khi trong đội có nhân vật như Sandrone, gồm Tinh-Siêu Dẫn (Băng + Lôi) và Khuếch Tán Băng phiên bản Tinh Tú (Băng + Phong). Món nào tăng ST Tinh Tú Lấp Lánh thì tăng luôn cả Tinh-Siêu Dẫn.",
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

  // ---- Nhân vật phụ: điền thêm build / rotation sau ----
  { id: "xilonen", name: "Xilonen", rarity: 5, element: "geo",  weapon: "sword",    role: "Support", region: "Natlan",
    icon: IMG + "a/ab/Xilonen_Icon.png/revision/latest" },
  { id: "bennett", name: "Bennett", rarity: 4, element: "pyro", weapon: "sword",    role: "Support", region: "Mondstadt",
    icon: IMG + "7/79/Bennett_Icon.png/revision/latest" },
  { id: "citlali", name: "Citlali", rarity: 5, element: "cryo", weapon: "catalyst", role: "Support", region: "Natlan",
    icon: IMG + "d/dd/Citlali_Icon.png/revision/latest" },
  { id: "sucrose", name: "Sucrose", rarity: 4, element: "anemo", weapon: "catalyst", role: "Support", region: "Mondstadt",
    icon: IMG + "0/0e/Sucrose_Icon.png/revision/latest" },
];
