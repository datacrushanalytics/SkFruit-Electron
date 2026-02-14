// Utility functions for route-based access control

/**
 * Fetch and populate route dropdown based on user's access level
 * @param {string} dropdownId - ID of the dropdown element
 * @param {boolean} includeAllOption - Whether to include "All Route" option for users with ALL access
 */
async function fetchUserBasedRoutes(dropdownId, includeAllOption = true) {
  try {
    const sessionData = JSON.parse(localStorage.getItem("sessionData"));
    const userId = sessionData[0].id;
    
    const response = await fetch(`http://94.136.190.129:3000/routeData/user-routes/${userId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const routes = await response.json();
    
    var dropdown = $("#" + dropdownId);
    dropdown.empty();
    
    // Add "All Route" option if user has ALL access and includeAllOption is true
    if (sessionData[0].route === 'ALL' && includeAllOption) {
      dropdown.append(
        $("<option></option>")
          .attr("value", "*")
          .text("All Route")
      );
    }
    
    // Add placeholder option
    dropdown.append(
      $("<option></option>")
        .attr("value", "")
        .text("Select route type")
        .prop("disabled", true)
        .prop("selected", true)
    );
    
    // Populate dropdown with user's accessible routes
    routes.forEach(function (route) {
      dropdown.append(
        $("<option></option>")
          .attr("value", route.route_name)
          .text(route.route_name)
      );
    });
    
    // Initialize Select2 if available
    if (typeof $.fn.select2 !== 'undefined') {
      dropdown.select2({
        placeholder: "Select route",
        closeOnSelect: false,
        allowClear: true
      });
    }
    
    // If user doesn't have ALL access, set their route as selected and readonly
    if (sessionData[0].route !== 'ALL') {
      dropdown.val(sessionData[0].route).trigger("change");
      dropdown.prop("disabled", true);
    }
  } catch (error) {
    console.error("Error loading user routes:", error);
  }
}

/**
 * Check if current user has access to all routes
 * @returns {boolean} - True if user has ALL route access
 */
function hasAllRouteAccess() {
  try {
    const sessionData = JSON.parse(localStorage.getItem("sessionData"));
    return sessionData && sessionData[0].route === 'ALL';
  } catch (error) {
    console.error("Error checking route access:", error);
    return false;
  }
}

/**
 * Get current user's route
 * @returns {string} - User's route or 'ALL' if has all access
 */
function getCurrentUserRoute() {
  try {
    const sessionData = JSON.parse(localStorage.getItem("sessionData"));
    return sessionData ? sessionData[0].route : null;
  } catch (error) {
    console.error("Error getting user route:", error);
    return null;
  }
}