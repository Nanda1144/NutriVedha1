$dirs = @(
  'frontend/user/public',
  'frontend/user/src/app',
  'frontend/user/src/assets',
  'frontend/user/src/components',
  'frontend/user/src/features',
  'frontend/user/src/hooks',
  'frontend/user/src/layouts',
  'frontend/user/src/pages',
  'frontend/user/src/routes',
  'frontend/user/src/services',
  'frontend/user/src/store',
  'frontend/user/src/types',
  'frontend/user/src/utils',
  'frontend/user/src/styles',
  'frontend/admin/public',
  'frontend/admin/src/app',
  'frontend/admin/src/assets',
  'frontend/admin/src/components',
  'frontend/admin/src/features',
  'frontend/admin/src/hooks',
  'frontend/admin/src/layouts',
  'frontend/admin/src/pages',
  'frontend/admin/src/routes',
  'frontend/admin/src/services',
  'frontend/admin/src/store',
  'frontend/admin/src/types',
  'frontend/admin/src/utils',
  'frontend/admin/src/styles',
  'backend/gateway/src',
  'backend/shared/src',
  'backend/packages/shared-types/src',
  'backend/packages/shared-validation/src',
  'backend/packages/shared-config/src',
  'backend/tests',
  'database/schema',
  'database/migrations',
  'database/seed',
  'database/diagrams',
  'database/documentation',
  'docs/architecture',
  'docs/workflows',
  'docs/design-system',
  'docs/database',
  'docs/api',
  'docs/security',
  'docs/testing',
  'docs/deployment',
  'docs/checklists',
  'docs/task-management',
  'scripts'
)

$services = @('auth', 'user', 'ai', 'medical', 'telemedicine', 'fitness', 'marketplace', 'notification', 'analytics', 'orders')
foreach ($s in $services) {
  $dirs += "backend/services/$s/src/controllers"
  $dirs += "backend/services/$s/src/routes"
  $dirs += "backend/services/$s/src/services"
  $dirs += "backend/services/$s/src/repositories"
  $dirs += "backend/services/$s/src/validators"
  $dirs += "backend/services/$s/src/middleware"
  $dirs += "backend/services/$s/src/types"
  $dirs += "backend/services/$s/tests"
}

foreach ($d in $dirs) {
  if (-not (Test-Path $d)) {
    New-Item -ItemType Directory -Path $d -Force | Out-Null
  }
}
Write-Output "Created $($dirs.Count) directory paths."
