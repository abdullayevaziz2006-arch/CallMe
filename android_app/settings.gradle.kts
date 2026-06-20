// android_app/settings.gradle.kts
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        // Vosk repository
        maven { url = java.net.URI("https://alphacephei.com/maven/repository") }
    }
}

rootProject.name = "Antigravity"
include(":app")
