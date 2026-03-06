# Schema Migration Guide - Moi Kanakku Backend

## Overview
This document outlines the migration from the old database schema to the new production-ready schema defined in `new_logic.sql`.

## Table Mapping

### User Management
| Old Table | Old Columns | New Table | New Columns |
|-----------|-------------|-----------|-------------|
| `gp_moi_user_master` | um_id, um_full_name, um_email, um_mobile, um_password, um_status, um_notification_token, um_profile_image, um_last_login, um_create_dt, um_update_dt | `users` | id, full_name, email, mobile, status, is_verified, last_activity_at, created_at, updated_at |
| (password storage) | um_password | `user_credentials` | password_hash, password_changed_at |
| (profile data) | um_profile_image | `user_profiles` | profile_image_url |
| (FCM tokens) | um_notification_token | `user_devices` | fcm_token, device_name |

### Persons/Relations
| Old Table | Old Columns | New Table | New Columns |
|-----------|-------------|-----------|-------------|
| `gp_moi_persons` | mp_um_id, mp_first_name, mp_second_name, mp_business, mp_city, mp_mobile | `persons` | user_id, first_name, last_name, occupation, city, mobile |

### Functions/Events
| Old Table | Old Columns | New Table | New Columns |
|-----------|-------------|-----------|-------------|
| `gp_moi_functions` | f_um_id, function_name, function_date, first_name, second_name, place | `transaction_functions` | user_id, function_name, function_date, location, notes |
| `gp_moi_functions` (upcoming) | (same fields) | `upcoming_functions` | user_id, title, function_date, location, status |

### Transactions
| Old Table | Old Columns | New Table | New Columns |
|-----------|-------------|-----------|-------------|
| `gp_moi_master_records` | mr_um_id, mr_function_id, mr_first_name, mr_amount | `transactions` | user_id, transaction_function_id, person_id, amount, type: 'INVEST', item_type: 'MONEY' |
| `gp_moi_out_master` | mom_user_id, mom_amount | `transactions` | user_id, amount, type: 'RETURN' |

### Referral System
| Old Table | New Table |
|-----------|-----------|
| (implicit in user table) | `user_referrals` (tracks referrer -> referred relationship) |

## Key Changes

### Field Naming
- `um_*` → no prefix (stored in `users` table)
- `mp_*` → no prefix (stored in `persons` table)
- `mcd_*` → no prefix (stored in `transactions` table)
- `f_*` → no prefix (stored in `transaction_functions` or `upcoming_functions`)

### UUID Handling
- Old: Auto-increment IDs
- New: Binary UUID16 with helper functions
  - `toBinaryUUID(uuid)` - Convert UUID string to binary for DB storage
  - `fromBinaryUUID(binaryUuid)` - Convert binary from DB to UUID string

### Password Storage
- Old: Single `um_password` field
- New: Separated into `user_credentials.password_hash`

### Notification Tokens
- Old: Single `um_notification_token` field
- New: Multiple tokens in `user_devices` table (supports multiple devices)

### Profile Images
- Old: `um_profile_image` in `gp_moi_user_master`
- New: `profile_image_url` in `user_profiles`

## Update Priority

1. **Phase 1 (Critical)**: User model/controller ✅ DONE
2. **Phase 2**: Persons model and related functionality
3. **Phase 3**: Functions/Transactions models
4. **Phase 4**: Credit/Debit and advanced features
5. **Phase 5**: Notifications and utilities
6. **Phase 6**: Admin and employee management

## Field Mapping Reference

### From mapUserRow Function
```javascript
// New Names → Old Compatibility Names
id → um_id
full_name → um_full_name
email → um_email
mobile → um_mobile
password_hash → um_password
status → um_status
last_activity_at → um_last_login
profile_image_url → um_profile_image
referral_code → um_referral_code
notification_token → um_notification_token
created_at → um_create_dt
updated_at → um_update_dt
```

## Implementation Notes

1. **Transaction Modes**: 'MONEY' or 'THING' replaces old `seimurai` field
2. **Function Types**: Separate tables for `transaction_functions` (historical records) and `upcoming_functions` (scheduled events)
3. **Soft Deletes**: Use `is_deleted` flag instead of hard deletes
4. **Timestamps**: Use UTC timestamps with timezone conversion in application layer

## Controller Response Mapping

When returning data to clients, map new field names to expected structure:

```javascript
const response = {
    id: user.id,              // previously user.um_id
    name: user.full_name,     // previously user.um_full_name
    email: user.email,        // unchanged
    mobile: user.mobile,      // previously user.um_mobile
    // ... etc
};
```
