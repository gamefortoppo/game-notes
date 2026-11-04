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
  "2U": "U (Unit) là độ dày của ấn nguyên tố gắn trên quái. 1U là ấn mỏng, 2U là ấn dày: trụ lâu hơn và chịu được nhiều lần phản ứng hơn. Nhờ vậy ấn 2U vừa đủ xóa ấn nguyên tố cũ, vừa còn dư để phủ ấn mới lên quái.",
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

  // ---- Nhân vật phụ: điền thêm build / rotation sau ----
  { id: "xilonen", name: "Xilonen", rarity: 5, element: "geo",  weapon: "sword",    role: "Support", region: "Natlan",
    icon: IMG + "a/ab/Xilonen_Icon.png/revision/latest" },
  { id: "bennett", name: "Bennett", rarity: 4, element: "pyro", weapon: "sword",    role: "Support", region: "Mondstadt",
    icon: IMG + "7/79/Bennett_Icon.png/revision/latest" },
  { id: "citlali", name: "Citlali", rarity: 5, element: "cryo", weapon: "catalyst", role: "Support", region: "Natlan",
    icon: IMG + "d/dd/Citlali_Icon.png/revision/latest" },
];
