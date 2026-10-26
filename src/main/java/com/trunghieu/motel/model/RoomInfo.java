package com.trunghieu.motel.model;

import java.util.List;

public class RoomInfo {
    private String id;
    private String name;
    private String description;
    private String hourlyPrice;
    private String overnightPrice;
    private String dailyPrice;
    private String image;
    private List<String> highlights;
    private boolean isPopular;

    public RoomInfo() {
    }

    public RoomInfo(String id, String name, String description, String hourlyPrice, 
                    String overnightPrice, String dailyPrice, String image, 
                    List<String> highlights, boolean isPopular) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.hourlyPrice = hourlyPrice;
        this.overnightPrice = overnightPrice;
        this.dailyPrice = dailyPrice;
        this.image = image;
        this.highlights = highlights;
        this.isPopular = isPopular;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getHourlyPrice() { return hourlyPrice; }
    public void setHourlyPrice(String hourlyPrice) { this.hourlyPrice = hourlyPrice; }

    public String getOvernightPrice() { return overnightPrice; }
    public void setOvernightPrice(String overnightPrice) { this.overnightPrice = overnightPrice; }

    public String getDailyPrice() { return dailyPrice; }
    public void setDailyPrice(String dailyPrice) { this.dailyPrice = dailyPrice; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public List<String> getHighlights() { return highlights; }
    public void setHighlights(List<String> highlights) { this.highlights = highlights; }

    public boolean isPopular() { return isPopular; }
    public void setPopular(boolean popular) { isPopular = popular; }
}
