enum ENVIRONMENT {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
  PROVISION = 'provision',
}

enum GENDERS {
  MALE = 'male',
  FEMALE = 'female',
  NON_BINARY = 'non-binary',
}

enum STATUS {
  SUCCESS = 'success',
  ERROR = 'error',
}

const DUMMY_TOKEN = '12345';

enum DIAGNOSTIC_CENTER_ACCEPTANCE_STATUSES {
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

enum ORDER_STATUS {
  NEW_ORDER = 'new_order',
  PAYMENT_SUCCESSFUL = 'payment_successful',
  AWAITING_KEY = 'awaiting_key',
  TEMP_KEY = 'temp_key',
  LICENSED = 'licensed',
  ASSIGNED = 'assigned',
  PROCESSING = 'processing',
  PROCESSED = 'processed',
  UNDER_REVIEW = 'under_review',
  VERIFICATION = 'verification',
  COMPLETED = 'completed',
}

enum CHARGE_STATUS {
  PAYSTACK_SUCCESS = 'charge.success',
  FLUTTERWAVE_SUCCESS = 'charge.completed',
}

enum CONTACT_METHODS {
  EMAIL = 'email',
  PHONE = 'phone',
}

enum ROLE {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  SENIOR_ADMIN = 'senior_admin',
  JUNIOR_ADMIN = 'junior_admin',
  FIELD_OFFICER = 'field_officer',
  DIAGNOSTIC_CENTER = 'diagnostic_center',
}

enum ENTIITY {
  USER = 'user',
  ORDER = 'order',
  RESULT = 'result',
  TEST_ITEM = 'test_item',
  TEST_TYPE = 'test_type',
}

enum MESSAGES {
  UPDATE_SUCCESS = 'Update successful',
  UPDATE_ERROR = 'Update failed',
  MISSING_DEPENDENCIES = 'One or more {0} are missing',
  MISSING_RESOURCE = '{0} not found',
  EXISTING_RESOURCE = '{0} already exists',
  EXISTING_USER = 'You have an existing account with this email, go to Login',
  EXISTING_PROVIDER = 'The Service Provider you are trying to create already exists',
  EXISTING_PRODUCT = 'The Product you are trying to create already exists',
  EXISTING_COUNTRY = 'The Country you are trying to create already exists',
  EXISTING_CURRENCY = 'The Currency you are trying to create already exists',
  UNPROCESSABLE_ENTITY = 'Ooops! Something went wrong',
  RESTRICTED_LOOKUP = 'You are not allowed to lookup {0}',
}

enum NOTIFICATION_MESSAGES {
  ORDER_CREATED_VIA_DIAGNOSTIC_CENTER = `Your Order {0} has been successfully placed, you may proceed to {1} at your earliest convenience.`,
  ORDER_CREATED_VIA_FIELD_OFFICER = `Your Order {0} has been successfully placed and a health care professional will be in touch with you shortly on your provided contact number.`,
  ORDER_ASSIGNED_TO_FIELD_OFFICER = `Your Order {0} has been assigned to a field officer. You will be contacted shortly for order confirmation and plans to collect samples for your test.`,
  ORDER_MARKED_AS_COMPLETED = `Your Order {0} is ready, you can view your results Here.`,
}

enum GEO_JSON_TYPES {
  POINT = 'Point', // always use this. Change ONLY if you know what you're doing.
  MULTIPOINT = 'MultiPoint',
  LINE_STRING = 'LineString',
  MULTI_LINE_STRING = 'MultiLineString',
  POLYGON = 'Polygon',
  MULTI_POLYGON = 'MultiPolygon',
  GEOMETRY = 'Geometry',
  GEOMETRY_COLLECTION = 'GeometryCollection',
  FEATURE = 'Feature',
  FEATURE_COLLECTION = 'FeatureCollection',
}

const SCHEMA_DEFAULTS = {
  IS_REQUIRED: { required: true },
  IS_FALSE: { default: false },
  IS_BOOLEAN: { type: Boolean },
  IS_USER: { default: [ROLE.USER] },
  IS_DIAGNOSTIC_CENTER: { default: [ROLE.USER, ROLE.DIAGNOSTIC_CENTER] },
  IS_NUMBER: { type: Number },
  IS_STRING: { type: String },
  IS_OBJECT: { type: Object },
  IS_ARRAY: { type: Array },
  IS_DATE: { type: Date, default: new Date() },
  IS_FIELD_OFFICER: { default: [ROLE.USER, ROLE.FIELD_OFFICER] },
  IS_JUNIOR_ADMIN: { default: [ROLE.USER, ROLE.JUNIOR_ADMIN] },
  IS_SENIOR_ADMIN: { default: [ROLE.USER, ROLE.ADMIN] },
  IS_SUPER_ADMIN: {
    default: [
      ROLE.USER,
      ROLE.JUNIOR_ADMIN,
      ROLE.SENIOR_ADMIN,
      ROLE.ADMIN,
      ROLE.SUPER_ADMIN,
    ],
  },
  IS_ADMIN: { default: [ROLE.USER, ROLE.ADMIN] },
  CONTACT_METHODS: [CONTACT_METHODS.EMAIL],
  IS_UNIQUE: { unique: true },
  NOW: { default: Date.now },
  LOWERCASE: { lowercase: true },
  NEW_ORDER: { default: [ORDER_STATUS.NEW_ORDER] },
};

enum DECORATOR_KEYS {
  IS_PUBLIC_KEY = 'isPublic',
  ROLES_KEY = 'roles',
}

const EMAILS = {
  CONFIRMATION: {
    TEMPLATE_NAME: 'confirmation',
    SUBJECT: 'Welcome to Signal App! Confirm your Email',
  },
  NEW_ORDER: {
    TEMPLATE_NAME: 'new-order',
    SUBJECT: 'Order Purchase Successful',
  },
  TEST_RESULT_READY: {
    TEMPLATE_NAME: 'test-result-ready',
    SUBJECT: 'Test Result Ready',
  },
};

const SEARCH_FIELDS = {
  USER: {
    USERNAME: 'username',
    EMAIL_ADDRESS: 'email_address',
    GENDER: 'gender',
    FIRST_NAME: 'first_name',
    LAST_NAME: 'last_name',
    PHONE_NUMBER: 'phone_number',
    ROLE: 'role',
    DATE_OF_BIRTH: 'date_of_birth',
  },
  DIAGNOSTIC_CENTER: {
    NAME: 'name',
    EMAIL_ADDRESS: 'email_address',
    PHONE_NUMBER: 'phone_number',
    ADDRESS: 'address',
    DESCRIPTION: 'description',
  },
  TEST_ITEMS: {
    NAME: 'name',
    CODE: 'code',
    DESCRIPTION: 'description',
  },
};

enum ADDRESS_SECTION {
  STREET = 'street',
  CITY = 'city',
  LOCAL_GOVERNMENT_AREA = 'local_government_area',
  STATE = 'state',
  COUNTRY = 'country',
  ZIP = 'zip',
}

enum SEARCH_PATTERN {
  LITERAL = 'literal',
  REGEX = 'regex',
}

const RESPONSES = {
  TOKEN_SENT: 'Token sent',
  DUMMY_TOKEN: `Token is not sent in dev. Use '${DUMMY_TOKEN}' instead`,
  TOKEN_NOT_SENT: 'Token not sent',
};

const CACHE_KEYS = {
  USER_TOKEN: (email_address: string, token: string) =>
    `${email_address}_${token}`,
  PUBLIC_RESULT: (sharing_code: string) => `${sharing_code}_public_result`,
};

enum LOGIN_ENTITIES {
  USER = 'user',
  ADMIN = 'admin',
}

const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

enum CONTENT_OUTCOMES {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
}

export {
  ENVIRONMENT,
  GENDERS,
  STATUS,
  SCHEMA_DEFAULTS,
  DECORATOR_KEYS,
  ROLE,
  MESSAGES,
  ORDER_STATUS,
  CHARGE_STATUS,
  CONTACT_METHODS,
  EMAILS,
  CACHE_KEYS,
  RESPONSES,
  GEO_JSON_TYPES,
  LOGIN_ENTITIES,
  DIAGNOSTIC_CENTER_ACCEPTANCE_STATUSES,
  ACCEPTED_FILE_TYPES,
  CONTENT_OUTCOMES,
  DUMMY_TOKEN,
  NOTIFICATION_MESSAGES,
  ENTIITY,
  SEARCH_FIELDS,
  SEARCH_PATTERN,
  ADDRESS_SECTION,
};
