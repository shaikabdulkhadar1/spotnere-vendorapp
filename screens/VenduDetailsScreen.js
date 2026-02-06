/**
 * Vendu Details Screen Component
 * Displays place details with banner image, place information, and gallery
 */

import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/colors";
import { fonts } from "../constants/fonts";
import { supabase } from "../config/supabase";
import { Country, State, City } from "country-state-city";
import { useApp } from "../contexts/AppContext";

const { width } = Dimensions.get("window");

const VenduDetailsScreen = () => {
  const { user, placeData, loadPlace } = useApp();
  const [loading, setLoading] = React.useState(false);
  const [galleryImages, setGalleryImages] = React.useState([]);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [editFormData, setEditFormData] = React.useState({});
  const [showCountryModal, setShowCountryModal] = React.useState(false);
  const [showStateModal, setShowStateModal] = React.useState(false);
  const [showCityModal, setShowCityModal] = React.useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = React.useState("");
  const [selectedStateCode, setSelectedStateCode] = React.useState("");

  React.useEffect(() => {
    if (user?.place_id) {
      // Check cache first, then fetch if needed
      loadPlace(false);
    }
  }, [user?.place_id, loadPlace]);

  // Initialize form data when placeData is available
  React.useEffect(() => {
    if (placeData) {
      setEditFormData({
        name: placeData.name || "",
        category: placeData.category || "",
        sub_category: placeData.sub_category || "",
        description: placeData.description || "",
        address: placeData.address || "",
        city: placeData.city || "",
        state: placeData.state || "",
        country: placeData.country || "",
        postal_code: placeData.postal_code || "",
        location_map_link: placeData.location_map_link || "",
        phone_number: placeData.phone_number || "",
        website: placeData.website || "",
        rating: placeData.rating?.toString() || "",
        review_count: placeData.review_count?.toString() || "",
        avg_price: placeData.avg_price?.toString() || "",
        hours: placeData.hours || "",
        amenities: normalizeAmenities(placeData.amenities),
      });
      setLoading(false);
    }
  }, [placeData]);

  React.useEffect(() => {
    if (!isEditing) return;
    const countryCode =
      Country.getAllCountries().find(
        (item) => item.name === editFormData.country,
      )?.isoCode || "";
    setSelectedCountryCode(countryCode);
    if (!countryCode) {
      setSelectedStateCode("");
      return;
    }
    const stateCode =
      State.getStatesOfCountry(countryCode).find(
        (item) => item.name === editFormData.state,
      )?.isoCode || "";
    setSelectedStateCode(stateCode);
  }, [editFormData.country, editFormData.state, isEditing]);

  const normalizeAmenities = (value) => {
    if (Array.isArray(value)) {
      return value.filter(Boolean).join(", ");
    }
    return value || "";
  };

  const parseAmenitiesInput = (value) => {
    if (!value || !value.trim()) return null;
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  // Banner image from place data
  const bannerImage = placeData?.banner_image_link || null;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Reset form data to original place data from cache
    if (placeData) {
      setEditFormData({
        name: placeData.name || "",
        category: placeData.category || "",
        sub_category: placeData.sub_category || "",
        description: placeData.description || "",
        address: placeData.address || "",
        city: placeData.city || "",
        state: placeData.state || "",
        country: placeData.country || "",
        postal_code: placeData.postal_code || "",
        location_map_link: placeData.location_map_link || "",
        phone_number: placeData.phone_number || "",
        website: placeData.website || "",
        rating: placeData.rating?.toString() || "",
        review_count: placeData.review_count?.toString() || "",
        avg_price: placeData.avg_price?.toString() || "",
        hours: placeData.hours || "",
        amenities: normalizeAmenities(placeData.amenities),
      });
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    const placeId = user?.place_id || placeData?.id;
    if (!placeId) return;

    setIsSaving(true);
    try {
      // Prepare update data, converting strings to numbers where needed
      const updateData = {
        name: editFormData.name || null,
        category: editFormData.category || null,
        sub_category: editFormData.sub_category || null,
        description: editFormData.description || null,
        address: editFormData.address || null,
        city: editFormData.city || null,
        state: editFormData.state || null,
        country: editFormData.country || null,
        postal_code: editFormData.postal_code || null,
        location_map_link: editFormData.location_map_link || null,
        phone_number: editFormData.phone_number || null,
        website: editFormData.website || null,
        rating: editFormData.rating ? parseFloat(editFormData.rating) : null,
        review_count: editFormData.review_count
          ? parseInt(editFormData.review_count)
          : null,
        avg_price: editFormData.avg_price
          ? parseFloat(editFormData.avg_price)
          : null,
        hours: editFormData.hours || null,
        amenities: parseAmenitiesInput(editFormData.amenities),
        updated_at: new Date().toISOString(),
        last_updated: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("places")
        .update(updateData)
        .eq("id", placeId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setIsEditing(false);
      Alert.alert("Success", "Place details updated successfully!");
      // Refresh place data cache
      await loadPlace(true);
    } catch (error) {
      console.error("Error updating place:", error);
      Alert.alert("Error", "Failed to update place details. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDropdownSelect = (field, value, code = "") => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "country") {
      setShowCountryModal(false);
      setSelectedCountryCode(code);
      setSelectedStateCode("");
      setEditFormData((prev) => ({ ...prev, state: "", city: "" }));
    } else if (field === "state") {
      setShowStateModal(false);
      setSelectedStateCode(code);
      setEditFormData((prev) => ({ ...prev, city: "" }));
    } else if (field === "city") {
      setShowCityModal(false);
    }
  };

  const countries = Country.getAllCountries();
  const states = selectedCountryCode
    ? State.getStatesOfCountry(selectedCountryCode)
    : [];
  const cities =
    selectedCountryCode && selectedStateCode
      ? City.getCitiesOfState(selectedCountryCode, selectedStateCode)
      : [];

  const renderEditableField = (
    label,
    field,
    icon,
    keyboardType = "default",
    multiline = false,
    editable = true,
  ) => {
    const getDisplayValue = () => {
      const value = placeData?.[field];
      if (value === null || value === undefined || value === "") {
        return "Add details";
      }
      // Format avg_price with $ prefix
      if (field === "avg_price" && typeof value === "number") {
        return `$${value.toString()}`;
      }
      // Convert numbers to strings
      if (typeof value === "number") {
        return value.toString();
      }
      return value;
    };

    return (
      <View style={styles.detailRow}>
        <Ionicons name={icon} size={20} color={colors.primary} />
        <View style={styles.detailContent}>
          <Text style={styles.detailLabel}>{label}</Text>
          {isEditing ? (
            editable ? (
              <TextInput
                style={[
                  styles.detailInput,
                  multiline && styles.detailInputMultiline,
                ]}
                value={editFormData[field] || ""}
                onChangeText={(value) => handleFieldChange(field, value)}
                placeholder={`Enter ${label.toLowerCase()}`}
                placeholderTextColor={colors.textSecondary}
                keyboardType={keyboardType}
                multiline={multiline}
                numberOfLines={multiline ? 3 : 1}
              />
            ) : (
              <Text style={[styles.detailValue, styles.detailValueDisabled]}>
                {getDisplayValue()}
              </Text>
            )
          ) : (
            <Text style={styles.detailValue} numberOfLines={multiline ? 3 : 1}>
              {getDisplayValue()}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderLocationDropdown = (
    label,
    field,
    icon,
    options,
    showModal,
    setShowModal,
    getValue,
    getDisplayValue,
    disabled = false,
  ) => {
    const selectedValue = editFormData[field];
    const selectedOption = options.find(
      (item) => getValue(item) === selectedValue,
    );
    const displayText = selectedOption
      ? getDisplayValue(selectedOption)
      : "Add details";

    return (
      <View style={styles.detailRow}>
        <Ionicons name={icon} size={20} color={colors.primary} />
        <View style={styles.detailContent}>
          <Text style={styles.detailLabel}>{label}</Text>
          {isEditing ? (
            <>
              <TouchableOpacity
                style={[
                  styles.detailDropdown,
                  disabled && styles.detailDropdownDisabled,
                ]}
                onPress={() => !disabled && setShowModal(true)}
                disabled={disabled}
              >
                <Text
                  style={[
                    styles.detailDropdownText,
                    !selectedValue && styles.detailDropdownPlaceholder,
                  ]}
                  numberOfLines={1}
                >
                  {displayText}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={18}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>

              <Modal
                visible={showModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowModal(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Select {label}</Text>
                      <TouchableOpacity
                        onPress={() => setShowModal(false)}
                        style={styles.modalCloseButton}
                      >
                        <Ionicons name="close" size={24} color={colors.text} />
                      </TouchableOpacity>
                    </View>
                    {options.length === 0 ? (
                      <View style={styles.modalEmpty}>
                        <Text style={styles.modalEmptyText}>
                          {disabled
                            ? "Please select a country first"
                            : "No options available"}
                        </Text>
                      </View>
                    ) : (
                      <FlatList
                        data={options}
                        keyExtractor={(item, index) =>
                          getValue(item) || `option-${index}`
                        }
                        renderItem={({ item }) => {
                          const value = getValue(item);
                          const display = getDisplayValue(item);
                          const isSelected = selectedValue === value;

                          return (
                            <TouchableOpacity
                              style={[
                                styles.modalItem,
                                isSelected && styles.modalItemSelected,
                              ]}
                              onPress={() =>
                                handleDropdownSelect(
                                  field,
                                  value,
                                  item.isoCode || "",
                                )
                              }
                            >
                              <Text
                                style={[
                                  styles.modalItemText,
                                  isSelected && styles.modalItemTextSelected,
                                ]}
                              >
                                {display}
                              </Text>
                              {isSelected && (
                                <Ionicons
                                  name="checkmark"
                                  size={20}
                                  color={colors.primary}
                                />
                              )}
                            </TouchableOpacity>
                          );
                        }}
                        style={styles.modalList}
                      />
                    )}
                  </View>
                </View>
              </Modal>
            </>
          ) : (
            <Text style={styles.detailValue}>
              {placeData?.[field] || "Add details"}
            </Text>
          )}
        </View>
      </View>
    );
  };

  // Placeholder gallery images - replace with actual gallery images from place data
  const defaultGalleryImages = [
    // Add placeholder images or fetch from place.gallery_images
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Vendu Details</Text>
        <Text style={styles.description}>
          Manage your business information and vendor details
        </Text>
      </View>

      {/* Section 1: Banner Image */}
      <View style={styles.section}>
        <View style={styles.bannerContainer}>
          {bannerImage ? (
            <Image
              source={{ uri: bannerImage }}
              style={styles.bannerImage}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={styles.bannerPlaceholder}>
              <Ionicons
                name="image-outline"
                size={64}
                color={colors.textSecondary}
              />
              <Text style={styles.bannerPlaceholderText}>Banner Image</Text>
              <TouchableOpacity style={styles.addImageButton}>
                <Ionicons name="add-circle" size={24} color={colors.primary} />
                <Text style={styles.addImageText}>Add Banner Image</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Section 2: Place Details */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Place Details</Text>
          {!isEditing ? (
            <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
              <Ionicons
                name="create-outline"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.editActions}>
              <TouchableOpacity
                onPress={handleCancel}
                style={[styles.actionButton, styles.cancelButton]}
                disabled={isSaving}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                style={[styles.actionButton, styles.saveButton]}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.detailsCard}>
          {placeData ? (
            <>
              {/* Basic Information */}
              <View style={styles.detailRow}>
                <Ionicons name="business" size={20} color={colors.primary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Name</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.detailInput}
                      value={editFormData.name}
                      onChangeText={(value) => handleFieldChange("name", value)}
                      placeholder="Enter name"
                      placeholderTextColor={colors.textSecondary}
                    />
                  ) : (
                    <Text style={styles.detailValue}>
                      {placeData.name || "Add details"}
                    </Text>
                  )}
                </View>
              </View>

              {renderEditableField("Category", "category", "grid")}
              {renderEditableField("Sub Category", "sub_category", "list")}
              {renderEditableField(
                "Description",
                "description",
                "document-text",
                "default",
                true,
              )}

              {/* Location Information */}
              {renderEditableField(
                "Address",
                "address",
                "location",
                "default",
                true,
              )}
              {renderLocationDropdown(
                "Country",
                "country",
                "globe",
                countries,
                showCountryModal,
                setShowCountryModal,
                (item) => item.name,
                (item) => item.name,
              )}
              {renderLocationDropdown(
                "State",
                "state",
                "location-outline",
                states,
                showStateModal,
                setShowStateModal,
                (item) => item.name,
                (item) => item.name,
                !editFormData.country,
              )}
              {renderLocationDropdown(
                "City",
                "city",
                "map",
                cities,
                showCityModal,
                setShowCityModal,
                (item) => item.name,
                (item) => item.name,
                !editFormData.state,
              )}
              {renderEditableField("Postal Code", "postal_code", "mail")}
              {renderEditableField(
                "Location Map Link",
                "location_map_link",
                "map-outline",
                "url",
              )}

              {/* Contact Information */}
              {renderEditableField(
                "Phone Number",
                "phone_number",
                "call",
                "phone-pad",
              )}
              {renderEditableField(
                "Website",
                "website",
                "globe-outline",
                "url",
              )}

              {/* Business Information */}
              {renderEditableField(
                "Rating",
                "rating",
                "star",
                "decimal-pad",
                false,
                false,
              )}
              {renderEditableField(
                "Review Count",
                "review_count",
                "chatbubbles",
                "numeric",
                false,
                false,
              )}
              {renderEditableField(
                "Average Price",
                "avg_price",
                "cash",
                "decimal-pad",
              )}
              {renderEditableField("Hours", "hours", "time", "default", true)}
              {/* Amenities */}
              {renderEditableField(
                "Amenities",
                "amenities",
                "checkmark-circle",
                "default",
                true,
              )}
            </>
          ) : (
            <View style={styles.noDataContainer}>
              <Ionicons
                name="information-circle-outline"
                size={48}
                color={colors.textSecondary}
              />
              <Text style={styles.noDataText}>No place details available</Text>
            </View>
          )}
        </View>
      </View>

      {/* Section 3: Gallery */}
      <View style={styles.section}>
        <View style={styles.galleryHeader}>
          <Text style={styles.sectionTitle}>Gallery</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons
              name="add-circle-outline"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.addButtonText}>Add Image</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.galleryContainer}>
          {galleryImages.length > 0 || defaultGalleryImages.length > 0 ? (
            <View style={styles.galleryGrid}>
              {(galleryImages.length > 0
                ? galleryImages
                : defaultGalleryImages
              ).map((image, index) => (
                <View key={index} style={styles.galleryItem}>
                  {typeof image === "string" ? (
                    <Image
                      source={{ uri: image }}
                      style={styles.galleryImage}
                      contentFit="cover"
                      transition={200}
                    />
                  ) : (
                    <View style={styles.galleryPlaceholder}>
                      <Ionicons
                        name="image-outline"
                        size={32}
                        color={colors.textSecondary}
                      />
                    </View>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.galleryEmpty}>
              <Ionicons
                name="images-outline"
                size={64}
                color={colors.textSecondary}
              />
              <Text style={styles.galleryEmptyText}>No gallery images yet</Text>
              <TouchableOpacity style={styles.addImageButton}>
                <Ionicons name="add-circle" size={24} color={colors.primary} />
                <Text style={styles.addImageText}>Add Images to Gallery</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 10,
    marginBottom: 0,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.text,
    flex: 1,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  editActions: {
    flexDirection: "row",
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: colors.surface,
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.textSecondary,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: "#FFFFFF",
  },
  // Banner Image Section
  bannerContainer: {
    height: 200,
    backgroundColor: colors.surface,
    marginHorizontal: 10,
    borderRadius: 12,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  bannerPlaceholderText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: 8,
  },
  addImageButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
  },
  addImageText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.primary,
    marginLeft: 6,
  },
  // Place Details Section
  detailsCard: {
    backgroundColor: colors.cardBackground,
    marginHorizontal: 10,
    borderRadius: 12,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "flex-start",
  },
  detailContent: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 4,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
  detailValueDisabled: {
    color: colors.textSecondary,
  },
  detailInput: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.text,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 40,
  },
  detailInputMultiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  detailDropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 40,
  },
  detailDropdownText: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.text,
    marginRight: 8,
  },
  detailDropdownPlaceholder: {
    color: colors.textSecondary,
  },
  detailDropdownDisabled: {
    opacity: 0.6,
  },
  noDataContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noDataText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalList: {
    maxHeight: 400,
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalItemSelected: {
    backgroundColor: colors.surface,
  },
  modalItemText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  modalItemTextSelected: {
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
  modalEmpty: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  modalEmptyText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: "center",
  },
  // Gallery Section
  galleryContainer: {
    backgroundColor: colors.cardBackground,
    marginHorizontal: 10,
    borderRadius: 12,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  galleryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 0,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.primary,
    marginLeft: 4,
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
  },
  galleryItem: {
    width: (width - 32) / 3 - 6, // 3 columns: (screen - padding 10*2 + margin 6*2) / 3 - margin
    height: (width - 32) / 3 - 6,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: colors.surface,
    marginRight: 6,
    marginBottom: 6,
  },
  galleryImage: {
    width: "100%",
    height: "100%",
  },
  galleryPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  galleryEmpty: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 10,
  },
  galleryEmptyText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: 12,
    marginBottom: 8,
  },
});

export default VenduDetailsScreen;
